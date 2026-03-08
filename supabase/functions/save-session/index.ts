/**
 * Knowledge Attachment & Retrieval — Save Session
 *
 * Contract:
 * - Body: { sessionId?, transcriptChunk?: { role, content }, fieldValues?: Record<string, string|number|string[]> }
 * - Behavior: create or update session for agentId; append transcript chunk; merge fieldValues into collectedFields.
 *   If transcriptChunk provided and role is user: run context search(q=content), build prompt with persona + retrieved chunks,
 *   call LLM (OpenAI or alternate) with streaming; persist assistant reply and return nextPrompt in response.
 * - Returns: { success, nextPrompt?, sessionId? }
 *
 * Required secrets: OPENAI_API_KEY. Auth: optional (anonymous sessions); scope by agentId.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const agentId = url.pathname.split('/').filter(Boolean).pop()
    if (!agentId) {
      return new Response(
        JSON.stringify({ error: 'agentId required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json().catch(() => ({}))
    const sessionId = body?.sessionId ?? undefined
    const transcriptChunk = body?.transcriptChunk ?? undefined
    const fieldValues = body?.fieldValues ?? undefined

    // TODO: upsert session; append transcript; if user message, run retrieval + LLM, persist assistant message
    const newSessionId = sessionId ?? `sess_${Date.now()}_${agentId}`

    return new Response(
      JSON.stringify({
        success: true,
        nextPrompt: transcriptChunk?.role === 'user'
          ? "Thanks for your message. I'll use the knowledge I have to help you."
          : undefined,
        sessionId: newSessionId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Save session failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
