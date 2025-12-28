# Architecture

## High-level system

```mermaid
flowchart LR
    user[Authenticated user] --> browser[Next.js app]
    browser --> root_layout[Root layout]
    root_layout --> dashboard_layout[(dashboard) layout]
    dashboard_layout --> auth_shell[AuthBudgetShell]
    auth_shell --> budget_provider[BudgetDataProvider]
    budget_provider --> budget_context[Budget context]
    dashboard_layout --> client_shell[ProtectedAppLayout]
    client_shell --> feature_surfaces[Dashboard + feature routes]
    budget_provider --> api_routes[/App Router API routes/]
    api_routes --> external_api[Budget API Gateway]
    auth_shell --> cognito_api[Cognito]
    api_routes --> cognito_api
```

Key ideas:

- The root `app` directory runs on the Next.js App Router. Server components gate every protected route before hydrating client code.
- Authentication tokens live in HttpOnly cookies; server utilities read them to decide whether to redirect or hydrate the dashboard shell.
- Budget data is fetched server-side, cached with Next.js tags, and then injected into a React context that feeds every dashboard surface. Client hooks fall back to mock data when the API is unreachable, so the UI never renders empty states.

## Application shell & routing

- [`src/app/layout.tsx`](src/app/layout.tsx) sets up the HTML skeleton, global font, React Query provider, theme provider, and toasts.
- [`src/app/(dashboard)/layout.tsx`](<src/app/(dashboard)/layout.tsx>) wraps protected routes in a two-layer suspense shell:
  - `AuthBudgetShell` calls [`getCurrentUser`](src/server/auth.ts:178); unauthenticated requests are redirected to `/login` before any client-side code runs.
  - On success it renders [`BudgetDataProvider`](src/components/BudgetDatatProvider/BudgetDataProvider.tsx:18) inside `<Suspense>` with a loading fallback.
- [`ProtectedAppLayout`](src/components/ProtectedAppLayout/ProtectedAppLayout.tsx) is a client component that hydrates the sidebar, header, and `AuthProvider` context so that token refreshes happen on the client while the rest of the tree consumes authenticated state.
- Sub-routes under `src/app/(dashboard)` (dashboard, transactions, categories, goals, statistics, calendar, settings) are server components that mostly render client widgets.

## Authentication flow

- Server helpers in [`src/server/auth.ts`](src/server/auth.ts) wrap Cognito: reading cookies, refreshing tokens, and resolving the current user.
- API routes under `src/app/api/auth/*` perform Cognito mutations (`InitiateAuth`, `RespondToAuthChallenge`, refresh, logout) and set cookies with consistent security attributes.
- The login route [`src/app/login/page.tsx`](src/app/login/page.tsx) re-checks cookies server-side; if a session exists it redirects home, otherwise it hydrates [`AuthProvider`](src/contexts/auth-context.tsx:45) so that login, challenge handling, and token refresh happen client-side.
- [`AuthProvider`](src/contexts/auth-context.tsx:45) uses custom hooks (`useAuthRefresh`, `useBackgroundTokenRefresh`) to monitor expiry, call `/api/auth/refresh`, and fan out state to consumers like [`Header`](src/components/Header/Header.tsx:19).

## Budget data layer

1. **Server fetch** — [`getInitialBudgetData`](src/server/budget-data.ts:38) reads Cognito tokens, performs three parallel fetches against the remote Budget API, and returns a discriminated union to avoid route-level crashes. Responses are cached with `next: { tags: [...] }` so that invalidations from API routes instantly refresh server-rendered data.
2. **Provider** — [`BudgetDataProvider`](src/components/BudgetDatatProvider/BudgetDataProvider.tsx:18) calls the server loader and either hydrates [`BudgetProvider`](src/contexts/budget-context.tsx:70) with transactions/categories/goals or renders [`BudgetDataError`](src/components/Budget/BudgetDataError.tsx:25) (retry + offline fallback) if fetching fails.
3. **Context** — [`BudgetProvider`](src/contexts/budget-context.tsx:70) stores canonical lists, exposes CRUD operations (transactions/categories/goals), tracks the selected month, and a `refetch` helper that pulls from client-side `/api/*` wrappers.
4. **Hooks** — Client hooks assemble consumable slices:
   - [`useBudgetData`](src/hooks/use-budget-data.ts:11) merges context data with mock fallbacks, filters transactions by month, and produces derived metrics (totals, recent transactions, category limits, trends).
   - [`useStatisticsData`](src/hooks/use-statistics-data.ts:8) keeps an unfiltered view, creating grouped datasets for charts, ratio cards, and projections.
   - [`useCategoryChartController`](src/hooks/use-category-chart-controller.ts:61) powers the drill-down UX described in the charting plan.

## API layer & caching

- `src/api/budget-tracker-api/*` contains client-side wrappers (`fetchTransactions`, `createGoal`, etc.) that talk to `/api/*` endpoints. They centralize JSON parsing and error handling for optimistic UI flows.
- App Router API routes (e.g., [`src/app/api/transactions/route.ts`](src/app/api/transactions/route.ts)) forward requests to the external REST API. They inject Cognito ID tokens into the Authorization header, proxy status codes, and trigger cache invalidation via `revalidateTag` when mutations succeed.
- Cache tag constants live in [`src/constants/cache-tags.ts`](src/constants/cache-tags.ts); the server loader and API routes share them to keep SSR data synchronized with client writes.

## Feature surfaces

- **Dashboard** stitches together cards, charts, and summaries. Client components read from `useBudgetData` and `useCategoryChartController` so interactions never trigger network calls unless CRUD is required.
- **Transactions** use [`TransactionListWithFilters`](src/components/Transactions/TransactionListWithFilters/TransactionListWithFilters.tsx) plus [`useTransactionFilters`](src/hooks/use-transaction-filteres.ts:15) to perform purely client-side filtering on the selected month.
- **Categories & goals** expose CRUD flows composed of Radix dialogs (add/edit) and call the `/api/*` wrappers before updating the budget context.
- **Statistics** rely on [`StatisticsView`](src/components/Statistics/StatisticsView/StatisticsView.tsx) and Recharts-driven widgets that consume `useStatisticsData` for daily/weekly/monthly aggregations, ratios, savings projections, and category breakdowns.
- **Calendar** renders grouped transactions per day, reusing the same budget hook to avoid duplicate fetching.
- **Settings** centralizes personalization controls (currently theme, notifications placeholder, etc.).

## Shared UI system

- Design tokens live in [`src/app/globals.css`](src/app/globals.css) using Tailwind CSS 4 inline themes plus `@custom-variant` for dark mode.
- Component primitives under [`src/components/ui`](src/components/ui) are generated via shadcn/ui (`components.json` keeps aliases consistent) and wrap Radix for consistent accessibility.
- [`QueryProvider`](src/components/QueryProvider/QueryProvider.tsx:11) configures `@tanstack/react-query` with 5-minute stale windows and custom retry logic that skips `401`s, preparing the ground for any data that needs background refetching beyond the budget context.
- [`ThemeProvider`](src/components/ThemeProvider/ThemeProvider.tsx:6) and [`ModeToggle`](src/components/ModeToggle/ModeToggle.tsx:13) wire `next-themes` into the shell, delaying rendering until hydration finishes to prevent mismatches.
- Layout chrome (`Sidebar`, `Header`) are client components so they can respond to routing, toggle mobile drawers, surface search, and trigger sign-out via [`AuthProvider`](src/contexts/auth-context.tsx:45).

## Notable conventions

- File alias `@/*` keeps imports short (`tsconfig.json`), and every component folder contains its own index barrel to satisfy the repository style guide.
- Components stay under 300 lines because ESLint enforces `max-lines`; any shared logic must move into hooks (`src/hooks`) or utilities (`src/utils`).
- Mock data in [`src/mock`](src/mock) guarantees the UI stays interactive even without backend access, which is critical for local development and for the offline path surfaced by [`BudgetDataError`](src/components/Budget/BudgetDataError.tsx:25).
