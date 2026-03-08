import { cn } from '@/lib/utils'
import { Mail, Phone, MapPin } from 'lucide-react'

export interface ContactSectionProps {
  contactName?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  className?: string
}

/**
 * Renders privacy/DPO contact details with accessible mailto and tel links.
 * All optional props guarded for null/undefined before rendering.
 */
export function ContactSection({
  contactName,
  email,
  phone,
  address,
  className,
}: ContactSectionProps) {
  const name = contactName ?? 'Privacy / Data Protection Officer'
  const emailValue = email ?? ''
  const phoneValue = phone ?? ''
  const addressValue = address ?? ''

  return (
    <section
      id="contact"
      className={cn('scroll-mt-24', className)}
      aria-labelledby="contact-heading"
    >
      <h2
        id="contact-heading"
        className="text-foreground text-xl font-semibold tracking-tight md:text-2xl"
      >
        Contact information
      </h2>
      <p className="text-muted-foreground mt-3 text-base font-normal leading-relaxed">
        For privacy inquiries, data subject requests, or to submit an export or deletion request,
        please contact:
      </p>
      <dl className="text-muted-foreground mt-4 space-y-3 text-base">
        <div>
          <dt className="font-medium text-foreground">Contact</dt>
          <dd>{name}</dd>
        </div>
        {emailValue && (
          <div>
            <dt className="flex items-center gap-2 font-medium text-foreground">
              <Mail className="h-4 w-4" aria-hidden />
              Email
            </dt>
            <dd>
              <a
                href={`mailto:${emailValue}`}
                className="text-accent underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              >
                {emailValue}
              </a>
            </dd>
          </div>
        )}
        {phoneValue && (
          <div>
            <dt className="flex items-center gap-2 font-medium text-foreground">
              <Phone className="h-4 w-4" aria-hidden />
              Phone
            </dt>
            <dd>
              <a
                href={`tel:${phoneValue}`}
                className="text-accent underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              >
                {phoneValue}
              </a>
            </dd>
          </div>
        )}
        {addressValue && (
          <div>
            <dt className="flex items-center gap-2 font-medium text-foreground">
              <MapPin className="h-4 w-4" aria-hidden />
              Address
            </dt>
            <dd>{addressValue}</dd>
          </div>
        )}
      </dl>
    </section>
  )
}
