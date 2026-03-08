/**
 * Knowledge Attachment & Retrieval — Context Search
 *
 * Contract:
 * - Query: ?q=...&topK=10&threshold=0.7 (agentId from path)
 * - Behavior: optional retrieval cache lookup by queryHash; on miss, vector similarity search,
 *   return chunks with score >= threshold, ordered by score
 * - Returns: { chunks: [{ text, score, docId, chunkIndex, source, language?, metadata? }] }
 *
 * Required: vector store client (Pinecone/Weaviate/Milvus). Cache TTL 5–15 min; invalidate on upload.
 * Auth: public or optional JWT for analytics
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

    const q = url.searchParams.get('q') ?? ''
    const topK = Math.min(20, Math.max(1, parseInt(url.searchParams.get('topK') ?? '10', 10)))
    const threshold = parseFloat(url.searchParams.get('threshold') ?? '0.7') || 0.7

    // TODO: check RetrievalCache for agentId + queryHash; if miss, vector search(query, topK, threshold)
    const chunks: Array<{ text: string; score: number; docId: string; chunkIndex: number; source: string; language?: string; metadata?: Record<string, unknown> }> = []

    return new Response(
      JSON.stringify({ chunks }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Search failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
