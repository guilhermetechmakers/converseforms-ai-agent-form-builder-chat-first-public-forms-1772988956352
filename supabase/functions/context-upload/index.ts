/**
 * Knowledge Attachment & Retrieval — Context Upload
 *
 * Contract:
 * - Accepts: multipart/form-data with `files` (PDF, DOCX, HTML, TXT), optional `docTitle`, `language`, `category`
 * - Behavior: extract text, chunk (200–1000 tokens, 10–20% overlap), generate embeddings via provider,
 *   upsert into vector store (Pinecone/Weaviate/Milvus), invalidate retrieval cache for agent
 * - Returns: { indexedChunks, embeddingsCreated, durationMs, docId? }
 *
 * Required secrets: OPENAI_API_KEY (or embedding provider), vector store credentials via env
 * Auth: require JWT; scope by agentId ownership (RLS or server-side check)
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

    const formData = await req.formData()
    const files = formData.getAll('files') as File[]
    const fileList = Array.isArray(files) ? files : []
    const docTitle = formData.get('docTitle')?.toString() ?? undefined
    const language = formData.get('language')?.toString() ?? undefined
    const category = formData.get('category')?.toString() ?? undefined

    // TODO: run ingestion pipeline (extract text, chunk, embed, upsert), then clear cache for agentId
    // const indexedChunks = ...
    // const embeddingsCreated = ...
    const durationMs = 0
    const indexedChunks = 0
    const embeddingsCreated = 0

    return new Response(
      JSON.stringify({
        indexedChunks,
        embeddingsCreated,
        durationMs,
        docId: undefined,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Upload failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
