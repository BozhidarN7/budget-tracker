# Current Context

## Snapshot (June 2026)

- Authenticated shell, dashboard, transactions, categories, goals, statistics, calendar, and settings routes are live under `src/app/(dashboard)`.
- Cognito-based authentication is wired end to end (login, refresh, logout, new-password challenge) through the API routes in `src/app/api/auth/*` and the client [`AuthProvider`](src/contexts/auth-context.tsx:45).
- Budget data loads server-side via [`getInitialBudgetData`](src/server/budget-data.ts:38) and flows into [`BudgetProvider`](src/contexts/budget-context.tsx:70), while client hooks (`useBudgetData`, `useStatisticsData`, `useCategoryChartController`) power visualizations and fallbacks.
- The Expenses by Category drill-down plan from [`docs/expenses-by-category-chart-plan.md`](docs/expenses-by-category-chart-plan.md) has been implemented across dashboard and statistics views.
- **Recurring transactions:** `useRecurringInstances` generates virtual `Transaction` objects from `RecurringTransaction` rules for the selected month. Dashboard/statistics calculations now stay scoped to the loaded selected-month transaction rows, while calendar/reminder surfaces continue consuming `recurringInstances` for forward-looking recurring visibility.
- **Transactions pagination/bootstrap:** the server bootstrap path fetches the current month's first paginated `/transactions` page in [`getInitialBudgetData`](src/server/budget-data.ts:44) and hydrates [`BudgetProvider`](src/contexts/budget-context.tsx:157). The public budget contract now exposes a single `transactions` list backed directly by the month-scoped cache (`transactionsByMonth[selectedMonth].items`), and `transactionPagination` remains the paired selected-month `Load more` metadata.
- **Recent refactor:** the duplicate selected-month transaction store and public `transactionList` alias were removed. `loadMoreTransactions`, month switching, calendar rendering, and transaction CRUD now all read or update the same canonical month-scoped list, fixing the stale `Load more` UI bug caused by divergent state.
- **Dashboard summary contract:** dashboard summary widgets in `useBudgetData` now split into two source layers. Cards, savings progress, and the dashboard monthly trends chart derive from category `monthlyData[month].spent` so they stay authoritative for the full selected month, while `recentTransactions` remains intentionally tied to the loaded paginated selected-month transaction rows.
- **Category spend contract:** `monthlyData.spent` currently uses a split update model. Frontend transaction CRUD updates category spend for normal transactions in `src/contexts/budget/transaction-operations.ts`, while the backend updates category spend when recurring transactions are materialized. The contract is documented in `docs/backend-category-spend-reconciliation.md`.
- Mock datasets under [`src/mock`](src/mock) guarantee the UI remains interactive if the AWS gateway or Cognito tokens fail.
- Local environment targeting now supports both AWS stacks: `NEXT_PUBLIC_AWS_ENVIRONMENT=dev` switches API Gateway and Cognito client selection to the dev CloudFormation stack, while the default remains prod so `npm run build` still points at production resources.
- **Settings preferences:** the General settings tab now uses an explicit submit flow for `preferredCurrency` and `timezone`, backed by a generalized user preference save API. The timezone control is a searchable popover picker sourced from browser-supported IANA zones with `UTC` fallback, and successful saves refresh both user preference state and budget data.
- **Testing:** Vitest is configured (`vitest.config.ts` with `@/*` alias) and unit tests cover recurrence utilities (`src/utils/recurrence.test.ts`), recurring-instance deduplication (`src/hooks/use-budget-data/use-recurring-instances.test.ts`), transaction metrics (`src/hooks/use-budget-data/use-transaction-metrics.test.ts`), and statistics derivations (`src/hooks/use-statistics-data.test.ts`).

## Open considerations

1. **Environment drift:** `.nvmrc` targets Node 24 while `package.json` enforces Node 22. Choose a single version before onboarding more contributors or wiring CI.
2. **Observability & error reporting:** Failures currently surface via toasts and console output (e.g., API wrappers log errors). There is no structured logging or monitoring.
3. **Testing gap:** Unit tests exist for recurrence logic, but most of the UI, API routes, CRUD flows, and the new transaction pagination states remain untested. Expand Vitest coverage and add Playwright E2E before CI wiring.
4. **User preferences:** Theme still persists separately through `next-themes`, while newer server-backed preferences now include timezone alongside preferred currency. Additional persisted personalization items from the roadmap remain open.
5. **Data import/export & recurring transactions CRUD:** Recurring instance generation is implemented, but users cannot yet create or edit recurring rules in the UI. Current CRUD flows are single-entry only.
6. **API resilience:** Client wrappers swallow errors by returning empty arrays; this prevents crashes but hides issues. Consider surfacing typed errors to the UI and differentiating offline states beyond the initial load.
7. **Security reviews:** Cookies are HttpOnly+secure, but there is no CSRF mitigation for POST routes beyond default SameSite=Lax. Evaluate whether additional protection is needed.
8. **Backend timezone persistence:** The frontend now sends `timezone` through `/api/users`, but full end-to-end behavior still depends on the deployed backend actually round-tripping that field.
9. **Category spend consistency:** The current split ownership model is workable, but client category writes send full `monthlyData` objects, which creates a stale-overwrite risk if a backend recurring materialization updates the same category/month concurrently.
10. **Dashboard vs. statistics authority:** Dashboard summary widgets are now category-backed for month-wide accuracy, but `useStatisticsData()` still derives from loaded selected-month transactions. The two surfaces can diverge until statistics gets its own authoritative summary source or broader history endpoint.

## Near-term priorities (suggested)

- Align runtime/tooling versions (Node, npm flags) and document required environment variables in `.env.example` (not yet present).
- Expand test coverage beyond recurrence utilities (e.g., hooks, API routes, happy-path E2E) and wire CI.
- Extend the preference persistence pattern to additional settings from the chart plan (view toggles, default filters, overflow visibility).
- Harden API error handling by distinguishing auth failures, network timeouts, and validation errors in the `/api/*` proxies and client wrappers.
- Track product metrics (e.g., total income/expense accuracy, goal completion) once analytics requirements emerge.
- Revisit category spend ownership and move toward a single-writer backend model if recurring and normal transaction flows need stronger consistency guarantees.

## References

- Product goals: [`product.md`](.kilocode/rules/memory-bank/product.md)
- Technical stack: [`tech.md`](.kilocode/rules/memory-bank/tech.md)
- Architecture overview: [`architecture.md`](.kilocode/rules/memory-bank/architecture.md)
