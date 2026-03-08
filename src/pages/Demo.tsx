import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLandingData } from '@/hooks/useLandingData'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

/**
 * Demo page: redirects to the public demo agent URL (internal path or external).
 * If demoUrl is internal (e.g. /chat/demo), navigates in same tab; otherwise opens in new tab and shows a link.
 */
export default function Demo() {
  const navigate = useNavigate()
  const { demoUrl } = useLandingData()
  const url = typeof demoUrl === 'string' && demoUrl.length > 0 ? demoUrl : '/chat/demo'
  const isInternal = url.startsWith('/')

  useEffect(() => {
    if (isInternal) {
      navigate(url, { replace: true })
    }
  }, [isInternal, url, navigate])

  if (isInternal) {
    return (
      <AnimatedPage>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Redirecting to demo…</p>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-center text-muted-foreground">
          The demo opens in a new tab. If it didn’t, use the link below.
        </p>
        <Button asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open demo agent
          </a>
        </Button>
        <Link to="/" className="text-sm text-accent hover:underline">
          Back to home
        </Link>
      </div>
    </AnimatedPage>
  )
}
