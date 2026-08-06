import { type Budget, type BudgetsClient, budgetSchema } from '@finops/types'
import { budgetsFixture } from './fixtures/alerts'

/** Adaptador mock de AWS Budgets (`DescribeBudgets`). */
export class MockBudgetsClient implements BudgetsClient {
  async listBudgets(): Promise<Budget[]> {
    return budgetSchema.array().parse(budgetsFixture)
  }
}
