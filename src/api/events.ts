/**
 * Events ingestion API – POST /api/events/ingest for analytics pipeline.
 * Used by backend or client when recording session/validation events.
 */

import { api } from '@/lib/api'
import type { IngestEventPayload, IngestEventsResponse } from '@/types/analytics'

export const eventsApi = {
  /** POST /api/events/ingest – single or batch event ingestion */
  ingest: (events: IngestEventPayload | IngestEventPayload[]) => {
    const body = Array.isArray(events) ? { events } : { events: [events] }
    return api.post<IngestEventsResponse>('/events/ingest', body)
  },
}
