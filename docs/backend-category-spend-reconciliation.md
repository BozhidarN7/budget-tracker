# Backend Category Spend Reconciliation

## Status

Current implementation uses a split update contract for
`category.monthlyData[month].spent`.

This document records the intended contract in the current repository state,
the assumptions it relies on, and the validation points that should remain true
until a single-writer model is introduced.

## Contract

Category monthly spend is a shared aggregate assembled by two distinct update
paths:

1. **Normal transaction CRUD is maintained by the frontend.**
   - When a user adds, edits, or deletes a normal transaction, the frontend
     updates the matching category's `monthlyData[month].spent`.
   - This happens in
     `src/contexts/budget/transaction-operations.ts` via
     `updateCategorySpending()`.
   - The flow is:
     1. call the transaction API
     2. update local transaction state
     3. send a separate category update with adjusted `monthlyData`

2. **Recurring materialization is maintained by the backend.**
   - When the backend materializes a recurring transaction into a real
     transaction, it also updates category spend atomically.
   - The frontend assumes the backend category payload already reflects those
     recurring materializations when categories are fetched.

## Why this is acceptable for now

These two writers are responsible for different event sources:

1. Frontend category spend writes correspond to user-driven CRUD on normal
   transactions.
2. Backend category spend writes correspond to recurring transactions at the
   moment they are materialized.

This means the current system is **split ownership**, not overlapping
double-application of the exact same mutation path.

## Current read model

Category spend widgets already trust `monthlyData.spent`.

1. Dashboard/category spend data:
   - `src/hooks/use-budget-data/utils/category-metrics.ts`
2. Statistics category limit cards:
   - `src/hooks/use-statistics-data.ts`

Other financial reports still derive totals and trends from the transaction
stream, which is expected and should remain so unless product requirements
change.

## Validated code paths

### Frontend normal transaction path

Validated in the current branch:

1. `createTransaction()` only writes `/api/transactions`.
   - `src/api/budget-tracker-api/transactions.ts`
2. `updateTransaction()` only writes `/api/transactions/:id`.
   - `src/api/budget-tracker-api/transactions.ts`
3. `deleteTransaction()` only writes `/api/transactions/:id`.
   - `src/api/budget-tracker-api/transactions.ts`
4. Category spend updates for those actions happen separately in
   `createTransactionOperations()`.
   - `src/contexts/budget/transaction-operations.ts`
5. Category API writes occur through `/api/categories/:id` with updated
   `monthlyData`.
   - `src/api/budget-tracker-api/categories.ts`

### Backend recurring path

Validated by issue context and backend contract assumptions referenced in issue
`#21`:

1. Recurring materialization updates category spend on the backend.
2. Materialized recurring instances become canonical transactions returned from
   the transactions API.
3. The category API is expected to return `monthlyData.spent` that includes
   those materialized recurring expenses.

## Important assumptions

The split contract stays correct only if all of the following remain true:

1. Normal transaction CRUD performed by the frontend does **not** trigger an
   additional backend category spend mutation outside the explicit category
   update request.
2. Backend recurring materialization does **not** rely on the frontend to later
   reconcile the same materialized occurrence into category spend.
3. Editing or deleting a materialized recurring transaction through normal
   transaction CRUD either:
   - should be treated like any other transaction edit/delete by the frontend,
     or
   - is prevented by product rules.
4. Category spend is interpreted as the total monthly spend for the category,
   regardless of whether the originating transaction was created manually or by
   recurring materialization.

## Known risks

Even though this is not an overlapping write model, there are still risks:

1. **Lost update risk**
   - The frontend sends the full `monthlyData` object when adjusting spend for a
     normal transaction.
   - If backend recurring materialization updates the same category/month before
     the frontend category write lands, stale client state can overwrite the
     fresher aggregate.

2. **Cross-surface consistency risk**
   - Category spend cards read `monthlyData.spent`.
   - Totals and trend charts derive from transactions.
   - If the aggregate drifts, users can see conflicting numbers across views.

3. **Contract opacity**
   - Without this document, future changes can incorrectly assume either the
     frontend or backend is the only writer.

## Validation checklist

Any future change to transaction or recurring flows should preserve these
checks:

1. Adding a normal expense increases category `monthlyData.spent` for that
   month.
2. Editing a normal expense moves or adjusts category spend correctly.
3. Deleting a normal expense decreases category `monthlyData.spent`.
4. Materializing a recurring expense updates category spend even if the frontend
   did not perform a category write.
5. Dashboard, Categories, and Statistics show category spend consistent with the
   category payload returned by the server.

## Recommended next step

The current split update contract is workable, but the long-term safer design is
to move to a single-writer model for category spend.

Preferred direction:

1. Backend owns category spend aggregation for all transaction sources.
2. Frontend stops persisting `spent` directly and instead refetches or relies on
   revalidation after transaction mutations.

Until then, this document is the source of truth for the current contract.
