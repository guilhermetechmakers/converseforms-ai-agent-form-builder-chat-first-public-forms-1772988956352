import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types/session'

export interface ReplayControllerProps {
  /** All messages (assistant + user) in order; replay steps through assistant messages. */
  messages: ChatMessage[]
  /** Callback when replay index changes (e.g. to highlight a message or show validation gate). */
  onReplayIndexChange?: (index: number, message: ChatMessage | null) => void
  className?: string
}

/** Replay mode: step through assistant messages and show validation/knowledge decision points. */
export function ReplayController({
  messages,
  onReplayIndexChange,
  className,
}: ReplayControllerProps) {
  const safeMessages = Array.isArray(messages) ? messages : []
  const assistantIndices = safeMessages
    .map((m, i) => (m.role === 'assistant' ? i : -1))
    .filter((i) => i >= 0)
  const hasSteps = assistantIndices.length > 0
  const maxStep = hasSteps ? Math.max(0, assistantIndices.length - 1) : 0

  const [replayIndex, setReplayIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const currentMessageIndex = assistantIndices[replayIndex] ?? -1
  const currentMessage: ChatMessage | null =
    currentMessageIndex >= 0 ? safeMessages[currentMessageIndex] ?? null : null
  const hasValidationGate = Boolean(
    currentMessage?.metadata && 'validationGate' in currentMessage.metadata && currentMessage.metadata.validationGate
  )
  const hasKnowledgeLookup = Boolean(
    currentMessage?.metadata && 'knowledgeLookup' in currentMessage.metadata && currentMessage.metadata.knowledgeLookup
  )

  const notify = useCallback(
    (idx: number) => {
      const msgIdx = assistantIndices[idx] ?? -1
      const msg = msgIdx >= 0 ? safeMessages[msgIdx] ?? null : null
      onReplayIndexChange?.(idx, msg)
    },
    [assistantIndices, safeMessages, onReplayIndexChange]
  )

  const goTo = useCallback(
    (idx: number) => {
      const next = Math.max(0, Math.min(idx, maxStep))
      setReplayIndex(next)
      notify(next)
    },
    [maxStep, notify]
  )

  const handlePrev = () => goTo(replayIndex - 1)
  const handleNext = () => goTo(replayIndex + 1)
  const handleReset = () => {
    goTo(0)
    setIsPlaying(false)
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">Replay</CardTitle>
        <CardDescription>Step through assistant messages and decision points</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            disabled={!hasSteps}
            aria-label="Reset replay"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={!hasSteps || replayIndex <= 0}
            aria-label="Previous message"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!hasSteps}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={!hasSteps || replayIndex >= maxStep}
            aria-label="Next message"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          {hasSteps ? `Step ${replayIndex + 1} of ${maxStep + 1}` : 'No assistant messages to replay'}
        </div>
        {(hasValidationGate || hasKnowledgeLookup) && (
          <div className="flex flex-wrap gap-1.5">
            {hasValidationGate && (
              <span className="rounded bg-warning/15 px-2 py-0.5 text-xs text-warning">Validation</span>
            )}
            {hasKnowledgeLookup && (
              <span className="rounded bg-accent/15 px-2 py-0.5 text-xs text-accent">Knowledge</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
