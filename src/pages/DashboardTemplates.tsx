/**
 * Templates Library (page_014): Pre-built agent templates with clone-to-create flow.
 * Uses GET /api/templates and POST /api/agents/clone; fallback to default templates when API returns empty.
 */

import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { FileText, Loader2, CopyPlus } from 'lucide-react'
import { useTemplates, useCloneTemplate } from '@/hooks/useTemplates'
import { DEFAULT_TEMPLATES } from '@/data/templates-default'
import type { Template } from '@/types/template'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

function TemplateCard({
  template,
  onClone,
  isCloning,
}: {
  template: Template
  onClone: (templateId: string) => void
  isCloning: boolean
}) {
  const fields = template.defaultConfig?.fields ?? []
  const fieldLabels = (Array.isArray(fields) ? fields : [])
    .slice(0, 3)
    .map((f) => (f && typeof f === 'object' && 'label' in f ? f.label : ''))
    .filter(Boolean)

  return (
    <Card
      className={cn(
        'flex flex-col transition-all duration-200 hover:shadow-lg',
        'hover:-translate-y-0.5'
      )}
    >
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <CardTitle className="text-lg">{template.name ?? 'Template'}</CardTitle>
        <CardDescription>
          {template.description ?? 'Use this template to create a new agent.'}
        </CardDescription>
        {fieldLabels.length > 0 && (
          <p className="text-xs text-muted-foreground pt-1">
            Fields: {fieldLabels.join(', ')}
          </p>
        )}
      </CardHeader>
      <CardContent className="mt-auto">
        <Button
          onClick={() => onClone(template.id)}
          disabled={isCloning}
          className="w-full transition-all hover:scale-[1.02]"
          aria-label={`Clone ${template.name} template`}
        >
          {isCloning ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CopyPlus className="mr-2 h-4 w-4" />
          )}
          Clone template
        </Button>
      </CardContent>
    </Card>
  )
}

export default function DashboardTemplates() {
  const navigate = useNavigate()
  const { data: apiTemplates, isLoading } = useTemplates()
  const cloneTemplate = useCloneTemplate()

  const templates: Template[] =
    Array.isArray(apiTemplates) && apiTemplates.length > 0
      ? apiTemplates
      : DEFAULT_TEMPLATES

  const handleClone = (templateId: string) => {
    cloneTemplate.mutate(
      { templateId },
      {
        onSuccess: (agent) => {
          if (agent?.id) {
            toast.success('Template cloned. Opening editor.')
            navigate(`/dashboard/agents/${agent.id}`)
          } else {
            toast.error('Clone succeeded but no agent id returned.')
          }
        },
        onError: (err: Error) => {
          toast.error(err?.message ?? 'Failed to clone template.')
        },
      }
    )
  }

  const isCloning = cloneTemplate.isPending

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Templates</h1>
                <p className="text-muted-foreground">
                  Clone a template to create a new agent. Customize fields, validations, and persona in the editor.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/agents/new">Create from scratch</Link>
              </Button>
            </div>
          </div>
          <div className="p-8 max-w-[1200px]">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-[10px]" />
                ))}
              </div>
            ) : templates.length === 0 ? (
              <Card className="rounded-[10px] border-dashed p-12 text-center">
                <p className="text-muted-foreground">No templates available.</p>
                <Button className="mt-4" asChild>
                  <Link to="/dashboard/agents/new">Create agent from scratch</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    onClone={handleClone}
                    isCloning={isCloning}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
