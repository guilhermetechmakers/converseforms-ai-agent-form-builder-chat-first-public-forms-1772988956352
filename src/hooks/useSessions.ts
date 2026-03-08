import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { sessionsApi } from '@/api/sessions'
import type { ListSessionsParams, SessionDetail } from '@/types/session'

export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (params: ListSessionsParams) => [...sessionKeys.lists(), params] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
}

const PAGE_SIZE = 20

/**
 * Fetch paginated sessions. Normalizes response to { data: SessionSummary[], total }.
 */
export function useSessionsList(params: ListSessionsParams = {}) {
  const {
    page = 1,
    pageSize = PAGE_SIZE,
    status = 'all',
    sort = 'startedAt',
    order = 'desc',
  } = params
  return useQuery({
    queryKey: sessionKeys.list({ ...params, page, pageSize, status, sort, order }),
    queryFn: async () => {
      const res = await sessionsApi.list({
        ...params,
        page,
        pageSize,
        status,
        sort,
        order,
      })
      const data = Array.isArray(res?.data) ? res.data : []
      const total = typeof res?.total === 'number' ? res.total : data.length
      return {
        data,
        total,
        page: res?.page ?? page,
        pageSize: res?.pageSize ?? pageSize,
      }
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useSession(id: string | undefined) {
  return useQuery({
    queryKey: sessionKeys.detail(id ?? ''),
    queryFn: () => sessionsApi.getById(id!),
    enabled: !!id,
  })
}

export function useSessionExport(id: string | undefined, format: 'csv' | 'json') {
  return useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Session id required')
      const blob = await sessionsApi.exportSession(id, format)
      return { blob, filename: `session-${id}.${format}` }
    },
    onSuccess: ({ blob, filename }) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Export downloaded.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Export failed.')
    },
  })
}

export function useTagSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, tags }: { id: string; tags: string[] }) =>
      sessionsApi.tag(id, tags),
    onSuccess: (updated: SessionDetail | undefined) => {
      if (updated?.id) {
        queryClient.setQueryData(sessionKeys.detail(updated.id), updated)
      }
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() })
      toast.success('Session tagged.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Tag update failed.')
    },
  })
}

export function useAnnotateSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, annotation }: { id: string; annotation: string }) =>
      sessionsApi.annotate(id, annotation),
    onSuccess: (updated: SessionDetail | undefined) => {
      if (updated?.id) {
        queryClient.setQueryData(sessionKeys.detail(updated.id), updated)
      }
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() })
      toast.success('Annotation saved.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Annotation failed.')
    },
  })
}

export function useResendSessionWebhook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => sessionsApi.resendWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all })
      toast.success('Webhook resent.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Resend webhook failed.')
    },
  })
}

export function usePurgeSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => sessionsApi.purge(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: sessionKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() })
      toast.success('Session purged.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Purge failed.')
    },
  })
}

export function useBulkExportSessions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      format: 'csv' | 'json'
      sessionIds?: string[]
      dateFrom?: string
      dateTo?: string
    }) => sessionsApi.bulkExport(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() })
      toast.success('Export job started. You will be notified when ready.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Bulk export failed.')
    },
  })
}
