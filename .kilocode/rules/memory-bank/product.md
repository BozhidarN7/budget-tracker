# Product Vision

## Mission

Deliver a trustworthy personal finance cockpit that aggregates income, expenses, category budgets, and savings goals into a single, always-available workspace so individuals can understand cash flow, set limits, and adapt spending in real time.

## Target Users & Pain Points

| Persona                        | Pain Points                                                                                   | How the app helps                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Budget-conscious professionals | Fragmented records across bank portals and spreadsheets make it hard to see the full picture. | Unified dashboard, curated reports, and alerts expose income, expense, and savings progress immediately after login. |
| Families sharing expenses      | Need category caps and shared goals to keep joint spending on track.                          | Category limits and goal tracking establish per-topic guardrails with visual progress.                               |
| Individuals rebuilding savings | Require motivation and insight into trends to sustain new habits.                             | Trend charts, goals, and savings projection widgets show progress velocity and forecast future balances.             |

## Experience Pillars

### 1. Insightful dashboard

- The authenticated shell renders a responsive layout (sidebar + header) via [`src/components/ProtectedAppLayout/ProtectedAppLayout.tsx`](src/components/ProtectedAppLayout/ProtectedAppLayout.tsx), ensuring quick access to every surface.
- The main dashboard route combines cards, savings progress, category limits, and recent transactions to summarize the latest month in one glance.
- Month switching flows through the shared `MonthSelector`, ensuring downstream views stay synchronized.

### 2. Transactions management

- Users can add and filter transactions directly inside the transactions surface. [`TransactionListWithFilters`](src/components/Transactions/TransactionListWithFilters/TransactionListWithFilters.tsx) composes reusable filters with the list UI.
- Filtering state lives inside [`useTransactionFilters`](src/hooks/use-transaction-filteres.ts:15), supporting search, type/category toggles, and date ranges without re-fetches.

### 3. Category budgets & limits

- Users define categories, monthly limits, and historical spend by category. Category CRUD flows depend on the `/api/categories` routes that proxy to the external Budget API.
- The Expenses by Category suite (chart, legend, details dialog, list view) implements the large dataset strategy documented in [`docs/expenses-by-category-chart-plan.md`](docs/expenses-by-category-chart-plan.md).

### 4. Savings goals

- Dedicated goals views highlight goal status (`name`, `target`, `current`, `targetDate`) from [`src/types/budget.ts`](src/types/budget.ts).
- Widgets on the dashboard and the Goals page keep savings progress visible, with CTAs to add or edit goals.

### 5. Advanced analytics

- Statistics tab reuses hooks like [`useStatisticsData`](src/hooks/use-statistics-data.ts:8) to expose daily/weekly/monthly breakdowns, income vs. expenses ratios, category trends, and projections.
- Visualizations are powered by Recharts plus custom cards and tables, giving both narrative charts and tabular drill-downs.

### 6. Calendar-centric review

- The calendar view groups transactions by date to uncover rhythm and recurring charges, aligning with the "time-based summaries" goal from the brief.

### 7. Settings & personalization

- The settings surface centralizes profile preferences, while the global header includes theme toggles, notifications, and search affordances (`ModeToggle`, `Header`, `Sidebar`).
- Local storage assists with offline/low-connection fallbacks (e.g., via the BudgetData error UI), ensuring the workspace degrades gracefully.

### 8. Authentication & trust

- The login experience handles Cognito challenges (password reset, new-password-required) through `/api/auth/*` routes and the client-side [`AuthProvider`](src/contexts/auth-context.tsx:45).
- Protected routes always run through server-side auth checks before rendering sensitive data, reducing flicker and ensuring unauthorized users are redirected.

## Data Model Snapshot

Budget entities originate from [`src/types/budget.ts`](src/types/budget.ts):

- `Transaction`: `id`, `description`, `amount`, `date`, `category`, and `type` (`income` or `expense`).
- `Category`: `id`, `name`, `color`, `type`, and per-month `limit`/`spent` data to support caps.
- `Goal`: `id`, `name`, `target`, `current`, `targetDate`, `description`.

These shapes drive every hook and visualization, and mock data in `src/mock` preserves usability while backend integration is still in progress.

## Value & Success Signals

- **Clarity:** Users should answer "How much did I spend per category this month?" within one page load.
- **Control:** Category limit breaches or low savings progress are highlighted through cards and charts before statements arrive.
- **Momentum:** Goals, projections, and streak-like widgets motivate continued engagement.
- **Trust:** Authentication, error boundaries, and offline fallbacks prevent blank states and inspire confidence.

## Future Opportunities

- Persist personalization settings (theme, preferred chart mode, default filters) to align with the chart roadmap in [`docs/expenses-by-category-chart-plan.md`](docs/expenses-by-category-chart-plan.md).
- Introduce insights/alerts (e.g., "groceries exceeded limit") using the existing context data.
- Expand data ingestion (CSV import, recurring transactions, multi-currency) without rewriting the domain model.
