import {
  type CloudTrailClient,
  type TrailEvent,
  type TrailSummary,
  trailEventSchema,
  trailSummarySchema,
} from '@finops/types'
import { buildEventRecord, trailEventsFixture, trailSummaryFixture } from './fixtures/trail'

/** Adaptador mock de AWS CloudTrail (`LookupEvents`). */
export class MockCloudTrailClient implements CloudTrailClient {
  async getSummary(): Promise<TrailSummary> {
    return trailSummarySchema.parse(trailSummaryFixture)
  }

  async lookupEvents(): Promise<TrailEvent[]> {
    return trailEventSchema.array().parse(trailEventsFixture)
  }

  async getEventRecord(eventId: string): Promise<Record<string, unknown> | null> {
    const event = trailEventsFixture.find((e) => e.id === eventId)
    return event ? buildEventRecord(event) : null
  }
}
