import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAdminLogs } from '@/hooks/useAdmin'
import type { AdminLog, LogSeverity } from '@/types/admin'
import { AnimatedPage } from '@/components/AnimatedPage'
import { format } from 'date-fns'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const severityColors: Record<LogSeverity, string> = {
  info: 'bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))]',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-destructive/10 text-destructive',
}

export function SystemLogs() {
  const [type, setType] = useState<string>('')
  const [severity, setSeverity] = useState<string>('')
  const { data: logs = [], isLoading } = useAdminLogs({
    ...(type && { type }),
    ...(severity && { severity }),
  })
  const list = Array.isArray(logs) ? logs : []
  const [selectedLog, setSelectedLog] = useState<AdminLog | null>(null)

  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">System logs</h1>
        <p className="text-muted-foreground">Webhook failures, LLM errors, and system events.</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <CardTitle>Log feed</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={type || 'all'} onValueChange={(v) => setType(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="llm">LLM</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severity || 'all'} onValueChange={(v) => setSeverity(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              Loading...
            </div>
          ) : list.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-muted-foreground">
              <FileText className="h-10 w-10" />
              <p>No logs in this range.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {list.slice(0, 50).map((log) => (
                <button
                  key={log.id}
                  type="button"
                  className={cn(
                    'flex w-full flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-muted/50',
                    selectedLog?.id === log.id && 'ring-2 ring-primary'
                  )}
                  onClick={() => setSelectedLog(log)}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <Badge className={cn('shrink-0', severityColors[log.severity] ?? 'bg-muted')}>
                      {log.severity}
                    </Badge>
                    <span className="truncate text-sm text-foreground">{log.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {log.createdAt ? format(new Date(log.createdAt), 'PPp') : '—'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {selectedLog && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Log detail</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setSelectedLog(null)}>
              Close
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Type:</span> {selectedLog.type}</p>
            <p><span className="text-muted-foreground">Severity:</span> {selectedLog.severity}</p>
            <p><span className="text-muted-foreground">Message:</span> {selectedLog.message}</p>
            <p><span className="text-muted-foreground">Time:</span> {selectedLog.createdAt ? format(new Date(selectedLog.createdAt), 'PPpp') : '—'}</p>
            {selectedLog.payload != null && (
              <pre className="mt-2 overflow-auto rounded border border-border bg-muted/30 p-3 text-xs">
                {JSON.stringify(selectedLog.payload, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      )}
    </AnimatedPage>
  )
}
