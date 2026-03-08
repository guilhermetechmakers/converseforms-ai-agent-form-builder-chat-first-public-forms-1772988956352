import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import {
  useSession,
  useSessionExport,
  useTagSession,
  useAnnotateSession,
  useResendSessionWebhook,
  useMarkSessionReviewed,
} from '@/hooks/useSessions'
import { TranscriptViewer } from '@/components/sessions/TranscriptViewer'
import { StructuredFieldsPanel } from '@/components/sessions/StructuredFieldsPanel'
import { SessionMetadataPanel } from '@/components/sessions/SessionMetadataPanel'
import { ActionBar } from '@/components/sessions/ActionBar'
import { ReplayController } from '@/components/sessions/ReplayController'
import { AttachmentsGallery } from '@/components/sessions/AttachmentsGallery'

export default function SessionViewer() {
  const { id } = useParams<{ id: string }>()
  const [transcriptSearch, setTranscriptSearch] = useState('')

  const { data: session, isLoading, isError, error } = useSession(id)
  const exportMutation = useSessionExport(id)
  const tagMutation = useTagSession()
  const annotateMutation = useAnnotateSession()
  const resendWebhookMutation = useResendSessionWebhook()
  const markReviewedMutation = useMarkSessionReviewed()

  const handleExport = (format: 'csv' | 'json') => {
    if (!id) return
    exportMutation.mutate({ format })
  }

  const messages = session?.messages ?? []
  const extractedFields = session?.extractedFields ?? []
  const tags = session?.tags ?? []
  const metadata = session?.metadata
  const respondentMetadata = session?.respondentMetadata
  const attachments = session?.attachments ?? []
  const webhookDeliveries = session?.webhookDeliveries ?? []

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex h-screen overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="border-b border-border px-6 py-4 md:px-8">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </div>
            <div className="mx-auto max-w-[1200px] p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-36" />
                      <Skeleton className="h-4 w-56" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full" />
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Skeleton className="h-48 w-full rounded-[10px]" />
                  <Skeleton className="h-64 w-full rounded-[10px]" />
                  <Skeleton className="h-40 w-full rounded-[10px]" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </AnimatedPage>
    )
  }

  if (isError || !session) {
    return (
      <AnimatedPage>
        <div className="flex h-screen overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="border-b border-border px-6 py-4 md:px-8">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/dashboard/sessions">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Session not found</h1>
                  <p className="text-sm text-muted-foreground">
                    {isError && error instanceof Error ? error.message : 'This session may have been removed.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="mx-auto max-w-[1200px] p-8">
              <Card className="border-destructive/30">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
                  <p className="text-muted-foreground text-center mb-4">
                    We couldn’t load this session. It may not exist or you may not have access.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/dashboard/sessions">Back to sessions</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-6 py-4 md:px-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild aria-label="Back to sessions">
                <Link to="/dashboard/sessions">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground md:text-2xl">
                  Session {session.agentName ? `${session.agentName} · ` : ''}{id ?? '—'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Transcript, extracted fields, and actions
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[1200px] p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <TranscriptViewer
                  messages={messages}
                  searchQuery={transcriptSearch}
                  onSearchChange={setTranscriptSearch}
                  maxHeight="480px"
                  className="animate-fade-in"
                />
                <StructuredFieldsPanel
                  fields={extractedFields}
                  showFilterSort={true}
                  className="animate-fade-in"
                />
                {attachments.length > 0 && (
                  <AttachmentsGallery attachments={attachments} className="animate-fade-in" />
                )}
              </div>

              <div className="space-y-6">
                <SessionMetadataPanel
                  metadata={metadata}
                  respondentMetadata={respondentMetadata}
                  className="animate-fade-in"
                />
                <ActionBar
                  sessionId={session.id}
                  tags={tags}
                  reviewedAt={session.reviewedAt}
                  webhookDeliveries={webhookDeliveries}
                  onExport={handleExport}
                  exportLoading={exportMutation.isPending}
                  onResendWebhook={() => resendWebhookMutation.mutate(session.id)}
                  resendWebhookLoading={resendWebhookMutation.isPending}
                  onTag={(newTags) =>
                    tagMutation.mutate(
                      { id: session.id, tags: newTags },
                      { onSuccess: () => {} }
                    )
                  }
                  tagLoading={tagMutation.isPending}
                  onAnnotate={(annotation) =>
                    annotateMutation.mutate(
                      { id: session.id, annotation },
                      { onSuccess: () => {} }
                    )
                  }
                  annotateLoading={annotateMutation.isPending}
                  onMarkReviewed={(reviewed) =>
                    markReviewedMutation.mutate(
                      { id: session.id, reviewed },
                      { onSuccess: () => {} }
                    )
                  }
                  markReviewedLoading={markReviewedMutation.isPending}
                  className="animate-fade-in"
                />
                <ReplayController
                  messages={messages}
                  className="animate-fade-in"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
