import {
  type AdvisorCategory,
  type AdvisorCategoryKey,
  advisorCategorySchema,
  type TrustedAdvisorClient,
} from '@finops/types'
import { advisorCategoriesFixture } from './fixtures/advisor'

/** Adaptador mock de Trusted Advisor (Support API). */
export class MockTrustedAdvisorClient implements TrustedAdvisorClient {
  async listCategories(): Promise<AdvisorCategory[]> {
    return advisorCategorySchema.array().parse(advisorCategoriesFixture)
  }

  async getCategory(key: AdvisorCategoryKey): Promise<AdvisorCategory | null> {
    const found = advisorCategoriesFixture.find((c) => c.key === key)
    return found ? advisorCategorySchema.parse(found) : null
  }
}
