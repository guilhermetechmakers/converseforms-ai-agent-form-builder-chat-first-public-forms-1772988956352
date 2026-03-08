# Edge Functions — Knowledge Attachment & Retrieval

These functions implement the server-side contract for context upload, search, and session persistence. The frontend calls your API (e.g. `VITE_API_URL`), which can proxy to these Edge Functions or implement the same contract with your own backend.

## Functions

| Function         | Purpose |
|------------------|--------|
| `context-upload` | Accept file uploads, extract text, chunk, embed, upsert to vector store; invalidate cache. |
| `context-search` | Vector similarity search with optional cache; returns chunks with score and metadata. |
| `save-session`   | Create/update chat session, append transcript, optional retrieval + LLM reply. |

## Vector Store Adapter (backend)

Implement a single interface so you can swap Pinecone, Weaviate, or Milvus:

- `upsertChunk(agentId, docId, chunkIndex, text, embedding, metadata)` → store with id
- `search(agentId, queryEmbedding, topK, threshold)` → `Array<{ text, score, docId, chunkIndex, source, metadata }>`

Use provider embeddings (e.g. OpenAI) or a local model; normalize embedding length and guard against NaN.

## Secrets

- `OPENAI_API_KEY` — for embeddings and chat completion (or use another provider).
- Vector store credentials — set via `supabase secrets set` and read with `Deno.env.get()`.

## Local development

```bash
supabase functions serve
```

Invoke with the path including agentId (e.g. `/context-upload/<agentId>`) and the expected query/body as per the contract in each `index.ts`.
