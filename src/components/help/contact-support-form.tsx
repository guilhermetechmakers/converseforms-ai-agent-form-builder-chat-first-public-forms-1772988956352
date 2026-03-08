import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Mail, Paperclip, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { submitContact } from '@/api/help'
import type { ContactPriority } from '@/types/help'

const PRIORITIES: ContactPriority[] = ['Low', 'Medium', 'High']

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

const contactSchema = z.object({
  name: z.string().max(200).optional(),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(1, 'Message is required').max(5000),
  priority: z.enum(['Low', 'Medium', 'High']),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactSupportForm() {
  const [attachments, setAttachments] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'Medium',
    },
  })

  const priority = watch('priority')

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null)
    const files = e.target.files
    if (!files?.length) return
    const next: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File "${file.name}" exceeds 5MB.`)
        return
      }
      const type = (file.type ?? '').toLowerCase()
      const allowed =
        type === 'application/pdf' ||
        type === 'image/png' ||
        type === 'image/jpeg' ||
        type === 'image/jpg'
      if (!allowed) {
        setFileError(`File "${file.name}": only PDF, PNG, JPG allowed.`)
        return
      }
      next.push(file)
    }
    setAttachments((prev) => [...(prev ?? []), ...next])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const list = prev ?? []
      return list.filter((_, i) => i !== index)
    })
  }

  const onSubmit = async (data: ContactFormValues) => {
    setFileError(null)
    try {
      const result = await submitContact({
        name: data.name || undefined,
        email: data.email,
        subject: data.subject,
        message: data.message,
        priority: data.priority,
        attachment: attachments?.[0]?.name ?? null,
      })
      if (result.success) {
        toast.success('Message sent. We\'ll get back to you soon.')
        reset()
        setAttachments([])
      } else {
        toast.error(result.message ?? 'Failed to send message.')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Contact support</CardTitle>
            <CardDescription>
              Send us a message. We'll respond as soon as we can.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name (optional)</Label>
              <Input
                id="contact-name"
                {...register('name')}
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
                className={cn(errors.name && 'border-destructive')}
              />
              {errors.name && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email (required)</Label>
              <Input
                id="contact-email"
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                className={cn(errors.email && 'border-destructive')}
              />
              {errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-subject">Subject (required)</Label>
            <Input
              id="contact-subject"
              {...register('subject')}
              placeholder="Brief subject"
              aria-invalid={Boolean(errors.subject)}
              className={cn(errors.subject && 'border-destructive')}
            />
            {errors.subject && (
              <p className="text-sm text-destructive" role="alert">
                {errors.subject.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(v) => setValue('priority', v as ContactPriority)}
            >
              <SelectTrigger id="contact-priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message">Message (required)</Label>
            <Textarea
              id="contact-message"
              {...register('message')}
              placeholder="Describe your question or issue..."
              rows={5}
              aria-invalid={Boolean(errors.message)}
              className={cn(errors.message && 'border-destructive')}
            />
            {errors.message && (
              <p className="text-sm text-destructive" role="alert">
                {errors.message.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-attachment">Attachment (optional, PDF/PNG/JPG, max 5MB)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="contact-attachment"
                type="file"
                accept="application/pdf,image/png,image/jpeg,image/jpg"
                onChange={onFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('contact-attachment')?.click()}
              >
                <Paperclip className="mr-2 h-4 w-4" />
                Add file
              </Button>
            </div>
            {(attachments ?? []).length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {(attachments ?? []).map((file, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1 text-destructive hover:text-destructive"
                      onClick={() => removeAttachment(i)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {fileError && (
              <p className="text-sm text-destructive" role="alert">
                {fileError}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send message'
            )}
          </Button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">
          You can also reach us at support@converseforms.com for urgent inquiries.
        </p>
      </CardContent>
    </Card>
  )
}
