/**
 * React Query hooks for Knowledge Attachment & Retrieval.
 * Guards all array/response shapes for runtime safety.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  uploadContext,
  searchContext,
  saveSession,
  listSessions,
  clearContext,
} from '@/api/context'
import type {
  ContextUploadMetadata,
  ContextSearchParams,
  SaveSessionBody,
} from '@/types/context'
import { agentKeys } from '@/hooks/useAgents'

export const contextKeys = {
  sessions: (agentId: string) => ['agents', agentKeys.detail(agentId), 'sessions'] as const,
}

/**
 * List sessions for an agent. Returns normalized sessions array.
 */
export function useAgentSessions(agentId: string | undefined) {
  return useQuery({
    queryKey: contextKeys.sessions(agentId ?? ''),
    queryFn: async () => {
      if (!agentId) return { sessions: [] }
      const res = await listSessions(agentId)
      const sessions = Array.isArray(res?.sessions) ? res.sessions : []
      return { sessions }
    },
    enabled: !!agentId,
    staleTime: 1000 * 60,
  })
}

/**
 * Upload context files for an agent. Invalidates agent detail and sessions.
 */
export function useUploadContext(agentId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      files,
      metadata,
    }: {
      files: File[]
      metadata?: ContextUploadMetadata
    }) => {
      if (!agentId) throw new Error('Agent ID required')
      return uploadContext(agentId, files, metadata)
    },
    onSuccess: (_, { metadata }) => {
      if (agentId) {
        queryClient.invalidateQueries({ queryKey: agentKeys.detail(agentId) })
        queryClient.invalidateQueries({ queryKey: contextKeys.sessions(agentId) })
      }
      toast.success(
        metadata?.docTitle
          ? `"${metadata.docTitle}" indexed successfully.`
          : 'Context uploaded and indexed.'
      )
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Context upload failed.')
    },
  })
}

/**
 * Search agent context (e.g. for preview). Returns chunks. Use as mutation.
 */
export function useContextSearchMutation(agentId: string | undefined) {
  return useMutation({
    mutationFn: (params: ContextSearchParams) => {
      if (!agentId) throw new Error('Agent ID required')
      return searchContext(agentId, params)
    },
  })
}

/**
 * Save session (append message / field values). Used by Public Chat.
 */
export function useSaveSession(agentId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: SaveSessionBody) => {
      if (!agentId) throw new Error('Agent ID required')
      return saveSession(agentId, body)
    },
    onSuccess: () => {
      if (agentId) {
        queryClient.invalidateQueries({ queryKey: contextKeys.sessions(agentId) })
      }
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to save session.')
    },
  })
}

/**
 * Clear all context for an agent.
 */
export function useClearContext(agentId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => {
      if (!agentId) throw new Error('Agent ID required')
      return clearContext(agentId)
    },
    onSuccess: () => {
      if (agentId) {
        queryClient.invalidateQueries({ queryKey: agentKeys.detail(agentId) })
        queryClient.invalidateQueries({ queryKey: contextKeys.sessions(agentId) })
      }
      toast.success('Context cleared.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to clear context.')
    },
  })
}
