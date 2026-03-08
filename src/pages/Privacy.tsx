import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function Privacy() {
  return (
    <AnimatedPage>
      <Navbar />
      <main className="min-h-screen px-6 py-12">
        <article className="mx-auto max-w-3xl prose prose-slate dark:prose-invert">
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          <section className="mt-8 space-y-4 text-muted-foreground">
            <h2 className="text-xl font-semibold text-foreground">Data we collect</h2>
            <p>We collect account information (email, name), conversation transcripts and extracted form data from sessions, and usage analytics to operate and improve the service.</p>
            <h2 className="text-xl font-semibold text-foreground">Retention</h2>
            <p>Session data is retained according to your plan settings. You can export or delete data from the dashboard.</p>
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p>For privacy requests or questions, contact us at privacy@converseforms.example.com.</p>
          </section>
        </article>
      </main>
      <Footer />
    </AnimatedPage>
  )
}
