import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DemoAgentLauncherProps {
  demoUrl: string
  className?: string
}

/**
 * Opens the public demo agent in the same tab (internal path) or new tab (absolute URL).
 */
export function DemoAgentLauncher({ demoUrl, className }: DemoAgentLauncherProps) {
  const navigate = useNavigate()
  const url = typeof demoUrl === 'string' ? demoUrl : '/chat/demo'
  const isInternal = url.startsWith('/')

  const handleClick = () => {
    if (isInternal) {
      navigate(url)
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Button
      type="button"
      size="lg"
      onClick={handleClick}
      className={cn(
        'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
        className
      )}
      aria-label="Open demo agent"
    >
      <Play className="mr-2 h-4 w-4" aria-hidden />
      Try Demo
    </Button>
  )
}
