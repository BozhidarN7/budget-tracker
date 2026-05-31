# Current Context

## Snapshot (May 2026)

- Authenticated shell, dashboard, transactions, categories, goals, statistics, calendar, and settings routes are live under `src/app/(dashboard)`.
- Cognito-based authentication is wired end to end (login, refresh, logout, new-password challenge) through the API routes in `src/app/api/auth/*` and the client [`AuthProvider`](src/contexts/auth-context.tsx:45).
- Budget data loads server-side via [`getInitialBudgetData`](src/server/budget-data.ts:38) and flows into [`BudgetProvider`](src/contexts/budget-context.tsx:70), while client hooks (`useBudgetData`, `useStatisticsData`, `useCategoryChartController`) power visualizations and fallbacks.
- The Expenses by Category drill-down plan from [`docs/expenses-by-category-chart-plan.md`](docs/expenses-by-category-chart-plan.md) has been implemented across dashboard and statistics views.
- **Recurring transactions:** `useRecurringInstances` generates virtual `Transaction` objects from `RecurringTransaction` rules for the selected month. A deduplication layer suppresses virtual instances when a real transaction with the matching `recurrenceInstanceId` already exists, so `combinedTransactions` never contains duplicates.
- Mock datasets under [`src/mock`](src/mock) guarantee the UI remains interactive if the AWS gateway or Cognito tokens fail.
- **Testing:** Vitest is configured (`vitest.config.ts` with `@/*` alias) and unit tests exist for recurrence utilities (`src/utils/recurrence.test.ts`) and recurring-instance deduplication (`src/hooks/use-budget-data/use-recurring-instances.test.ts`).

## Open considerations

1. **Environment drift:** `.nvmrc` targets Node 24 while `package.json` enforces Node 22. Choose a single version before onboarding more contributors or wiring CI.
2. **Observability & error reporting:** Failures currently surface via toasts and console output (e.g., API wrappers log errors). There is no structured logging or monitoring.
3. **Testing gap:** Unit tests exist for recurrence logic, but most of the UI, API routes, and CRUD flows remain untested. Expand Vitest coverage and add Playwright E2E before CI wiring.
4. **User preferences:** Feature roadmap items (persisting chart view modes, filters, theme) remain open; only theme preference uses `next-themes`.
5. **Data import/export & recurring transactions CRUD:** Recurring instance generation is implemented, but users cannot yet create or edit recurring rules in the UI. Current CRUD flows are single-entry only.
6. **API resilience:** Client wrappers swallow errors by returning empty arrays; this prevents crashes but hides issues. Consider surfacing typed errors to the UI and differentiating offline states beyond the initial load.
7. **Security reviews:** Cookies are HttpOnly+secure, but there is no CSRF mitigation for POST routes beyond default SameSite=Lax. Evaluate whether additional protection is needed.

## Near-term priorities (suggested)

- Align runtime/tooling versions (Node, npm flags) and document required environment variables in `.env.example` (not yet present).
- Expand test coverage beyond recurrence utilities (e.g., hooks, API routes, happy-path E2E) and wire CI.
- Implement preference persistence from the chart plan (store view toggle, overflow visibility) and expose insights/alerts for limit breaches.
- Harden API error handling by distinguishing auth failures, network timeouts, and validation errors in the `/api/*` proxies and client wrappers.
- Track product metrics (e.g., total income/expense accuracy, goal completion) once analytics requirements emerge.

## References

- Product goals: [`product.md`](.kilocode/rules/memory-bank/product.md)
- Technical stack: [`tech.md`](.kilocode/rules/memory-bank/tech.md)
- Architecture overview: [`architecture.md`](.kilocode/rules/memory-bank/architecture.md)
