import { useLocation, useSearchParams } from 'react-router-dom'
import { AnimatedPage } from '@/components/AnimatedPage'
import { ErrorHeroCard, FooterGuidance } from '@/components/server-error'

export interface ServerErrorProps {
  errorId?: string
  retryAction?: () => void
  statusUrl?: string
}

/**
 * 500 Server Error page. Uses location state / search params for errorId when navigated programmatically.
 * Default retry action is window.location.reload(); all data access is null-safe.
 */
export default function ServerError(props?: ServerErrorProps) {
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const state = location?.state as { errorId?: string; statusUrl?: string } | null | undefined
  const errorIdFromState = state?.errorId
  const errorIdFromSearch = searchParams?.get?.('errorId') ?? undefined
  const errorId =
    typeof props?.errorId === 'string'
      ? props.errorId
      : typeof errorIdFromState === 'string'
        ? errorIdFromState
        : errorIdFromSearch

  const statusUrl =
    typeof props?.statusUrl === 'string'
      ? props.statusUrl
      : typeof state?.statusUrl === 'string'
        ? state.statusUrl
        : '/status'

  const retryAction =
    typeof props?.retryAction === 'function'
      ? props.retryAction
      : () => window.location.reload()

  return (
    <AnimatedPage>
      <main
        className="relative flex min-h-screen flex-col items-center justify-center bg-muted/30 px-6 py-16 md:px-8 md:py-20"
        id="main-content"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(15,23,36,0.03)_0%,transparent_70%)]"
          aria-hidden
        />
        <div className="mx-auto flex w-full max-w-container flex-col items-center gap-12 px-4 md:px-8">
          <section className="flex w-full flex-col items-center text-center">
            <ErrorHeroCard
              errorId={errorId}
              retryAction={retryAction}
              statusUrl={statusUrl}
              statusLabel="Check system status"
            />
          </section>
          <section className="flex w-full flex-col items-center">
            <FooterGuidance />
          </section>
        </div>
      </main>
    </AnimatedPage>
  )
}
