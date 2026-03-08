import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function Terms() {
  return (
    <AnimatedPage>
      <Navbar />
      <main className="min-h-screen px-6 py-12">
        <article className="mx-auto max-w-3xl prose prose-slate dark:prose-invert">
          <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          <section className="mt-8 space-y-4 text-muted-foreground">
            <h2 className="text-xl font-semibold text-foreground">Acceptable use</h2>
            <p>You agree to use ConverseForms only for lawful purposes and not to abuse the service, send spam, or collect data in violation of applicable laws.</p>
            <h2 className="text-xl font-semibold text-foreground">Billing</h2>
            <p>Paid plans are billed in advance. Refunds are handled according to our billing policy.</p>
            <h2 className="text-xl font-semibold text-foreground">Liability</h2>
            <p>ConverseForms is provided "as is." We are not liable for indirect or consequential damages arising from use of the service.</p>
          </section>
        </article>
      </main>
      <Footer />
    </AnimatedPage>
  )
}
