# Backend Category Spend Reconciliation Report

**Date:** 2026-05-27
**Context:** Issues #7, #8, #9, #10 — recurring eligibility gating and category spend derivation
**Performed by:** Kilo agent (automated analysis + code inspection)
**Status:** Process documented with concrete examples from mocks + generator. Real backend verification is HITL (requires authenticated session with recurring data).

## Background

After the changes in this PR chain:

- Financial totals (income, expenses, net, category spend) are computed exclusively from the **eligible transaction stream**: all normal transactions + only recurring instances whose `scheduled date <= today` (determined at generation time via `recurrenceStatus !== 'scheduled'`).
- `category.monthlyData[month].spent` from the backend is **preserved in the data model** (for potential inheritance and debugging) but is **no longer the source of displayed spend** anywhere in the UI (Dashboard, Categories, Statistics).
- The authoritative source for displayed `spent` is now a frontend reduction over the eligible stream (see `computeSpentByCategory` in `src/hooks/use-budget-data/utils/category-metrics.ts`).

The purpose of this reconciliation is to compare the frontend-derived values against the backend-provided `monthlyData.spent` for the same category + month and surface any drift so it can be investigated as a backend defect (or confirmed as aligned).

## Reconciliation Procedure (for future manual runs)

1. Choose a representative month (preferably one with active recurring transactions that straddle "today").
2. Capture the raw categories payload from the Budget API (or via the client `BudgetContext` / `useBudgetData().categories` before any derivation).
3. For the same month, obtain the full list of normal transactions + _all_ generated recurring instances for the month (use the generator or inspect network).
4. Compute the **eligible subset** using the same rule: keep only recurring instances with scheduled date <= the "as of" date used by the UI (today in local time at render/generation).
5. Sum `amount` for expense transactions (normal + eligible recurring) grouped by `category` name, restricted to the target month.
6. For each expense category that has `monthlyData[month]`:
   - Record `backendSpent = monthlyData[month].spent`
   - Record `frontendDerived = the sum from step 5 for that category name`
7. Note the exact list of contributing normal tx ids + recurring instance ids (with their dates and amounts).
8. Compute diff = backendSpent - frontendDerived. Document sign and whether explainable (e.g. backend includes future scheduled, different month boundary, includes skipped/paused, currency conversion, etc.).
9. Repeat for at least 1-2 months and categories that have recurring activity.

## Example Analysis Using Mock Data (2026-05 representative)

The current mock data has limitations that prevent a perfect 1:1 numeric comparison:

- Recurring transactions exist for categories **Housing** (Rent, 1200 BGN monthly on the 5th), **Health** (Gym 45 on 10th), and **Savings** (50 weekly).
- However, `mockCategories` only defines: Food, Transport, Salary, Freelance, Education, Shopping. None of the recurring categories appear in the category list.

Therefore, when the app runs on mocks:

- The derived spend for "Housing", "Health", etc. would appear in `allTransactions` / `eligibleTransactions` (and thus affect grand totals), but would **not** appear in `expensesByCategory` or `categoryLimits` because those iterate over the provided `categories` array.
- The `monthlyData.spent` values present in mocks (e.g. Food current month backend 199.4) are populated independently of the recurring generator and do not include any contribution from the Housing/Health recurring items.

**Concrete observation (no mismatch possible to compute here):**

- For the current month key, the backend `monthlyData` values for the defined categories (Food, Transport, etc.) are hardcoded in the mock factory and do not incorporate the recurring generator at all.
- After #7/#8 the _displayed_ category spend for Food etc. will still match the mock values (since no eligible recurring transactions target "Food" or "Transport" in the mocks). Thus, for the categories that _do_ exist, frontend-derived == backend value by construction of the mocks.
- Any real recurring in Housing etc. that a user creates via the UI would, before these fixes, have caused totals to include future occurrences and category lists to under-report (missing categories) or over-report depending on backend population.

**Recommendation from this run:**
The mock data set should be extended (in a follow-up) with matching categories for the recurring fixtures (Housing, Health, Savings) plus sample normal transactions and a fixed "today" for deterministic eligible gating in tests. This would allow an automated assertion that derived spend == expected.

## Hypothetical Real-Data Walkthrough (template to fill by human)

**Month under test:** `2026-05` (or replace with actual `yyyy-MM`)
**"As of" / today used for eligibility:** `2026-05-27` (the date the analysis was performed)

| Category | Backend `monthlyData['2026-05'].spent` | Frontend-derived (eligible tx + eligible recurring) | Diff | Contributing normal tx (ids + amounts) | Contributing eligible recurring instances (id-date-amount) | Explainable? |
| -------- | -------------------------------------- | --------------------------------------------------- | ---- | -------------------------------------- | ---------------------------------------------------------- | ------------ |
| Housing  | (fill from API response)               | (sum from eligible stream)                          |      |                                        | Rent rec-1 on 2026-05-05 @1200 (eligible since 5 <= 27)    | ?            |
| Health   | (fill)                                 | (sum)                                               |      |                                        | Gym rec-2 on 2026-05-10 @45                                | ?            |

**Notes from human verifier:**

- (Add any observations about whether backend appears to be summing _all_ generated instances for the month regardless of scheduled date, or using a different cutoff such as month end, or including paused items, etc.)
- If diff != 0 and not explainable by currency/baseAmount or rounding, file a backend defect referencing this report and the eligible rule from #7.

## Conclusion & Recommendations

- The frontend is now the source of truth for all displayed financial aggregates and category spend. This eliminates the previous class of bugs where future scheduled recurring inflated current-month totals and category progress.
- Backend `monthlyData.spent` remains useful for:
  - Limit inheritance logic in the UI (CategoryCard).
  - Historical auditing / backend-driven reports.
  - This reconciliation process itself.
- **Backend owners** should review how `monthlyData[].spent` is populated for expense categories. It should either:
  a) Replicate the exact "eligible only (scheduled date <= as-of date)" rule using the same recurrence expansion the frontend uses, or
  b) Be treated as a separate "backend projection" and the contract updated to make the distinction explicit (e.g. rename or add `eligibleSpent` / `projectedSpent`).
- Once real data is available, a human should execute the procedure above for 1-2 months containing straddling recurring items and either confirm alignment or open a follow-up backend issue with the filled table.
- Consider adding a server-side test or a diagnostic endpoint that returns both the raw backend spent and a "recomputed from transactions + eligibility" value for the same periods to make drift immediately visible in observability.

This document (or its content) can be copied into a GitHub issue comment or the original #10 for long-term record.

**Related PRs:** #11 (7), #12 (8), #13 (9)

**References:**

- `src/hooks/use-budget-data/utils/category-metrics.ts` (computeSpentByCategory + get\* functions)
- `src/hooks/use-budget-data/use-recurring-instances.ts` (eligible filtering)
- `src/utils/recurrence.ts` + `recurrence-utils.ts` (instance generation + status)
- `docs/expenses-by-category-chart-plan.md` (prior large-dataset work)
