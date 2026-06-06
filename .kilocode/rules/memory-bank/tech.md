# Technology Stack

## Runtime & framework

- **Platform:** Next.js 16 App Router with React 19 and the experimental React Compiler enabled via [`next.config.ts`](next.config.ts).
- **Language:** TypeScript with strict mode (`tsconfig.json`) and the `@/*` path alias for `src`.
- **Runtime target:** `package.json` specifies Node `22.x` while [`.nvmrc`](.nvmrc) pins `v24.10.0`; align local tooling (e.g., via Volta or nvm) before installing dependencies.
- **Rendering model:** Server Components gate every authenticated route, then hydrate client shells for interactive widgets.

## Key libraries

| Domain        | Dependency                                                                          | Usage                                                                                                                                                                                                                    |
| ------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| UI primitives | `@radix-ui/*`, `shadcn/ui`, `lucide-react`                                          | Accessible dialogs, dropdowns, alerts, and icons reused across dashboards, forms, and sheets.                                                                                                                            |
| Styling       | Tailwind CSS 4 (`@tailwindcss/postcss`), `tw-animate-css`, `tailwind-merge`, `clsx` | Global design tokens live in [`src/app/globals.css`](src/app/globals.css); utilities rely on `cn` from [`src/lib/utils.ts`](src/lib/utils.ts:4).                                                                         |
| Data viz      | `recharts`                                                                          | Charts on dashboard and statistics tab.                                                                                                                                                                                  |
| State/data    | `@tanstack/react-query`, custom React contexts                                      | [`QueryProvider`](src/components/QueryProvider/QueryProvider.tsx:11) configures caching; [`BudgetProvider`](src/contexts/budget-context.tsx:70) and [`AuthProvider`](src/contexts/auth-context.tsx:45) own domain state. |
| Notifications | `sonner`                                                                            | Toast feedback for auth and CRUD operations.                                                                                                                                                                             |
| Auth & API    | `@aws-sdk/client-cognito-identity-provider`, native `fetch`                         | Cognito login/refresh, proxying to the external Budget API.                                                                                                                                                              |
| Utilities     | `date-fns`                                                                          | Parsing/formatting dates for charts, filters, and month math.                                                                                                                                                            |

## Data sources & integration

- **External REST API:** `API_BASE_URL` is derived in [`src/constants/api.ts`](src/constants/api.ts) from `NEXT_PUBLIC_AWS_ENVIRONMENT`, selecting either the prod or dev AWS API Gateway. App Router API routes forward authenticated requests and revalidate cache tags declared in [`src/constants/cache-tags.ts`](src/constants/cache-tags.ts).
- **Authentication:** Cognito client selection is environment-aware through `getCognitoClientId()` in [`src/constants/api.ts`](src/constants/api.ts). Prod uses `NEXT_PUBLIC_COGNITO_CLIENT_ID`; dev can override with `NEXT_PUBLIC_COGNITO_CLIENT_ID_DEV`. A parallel helper exists for user pools (`NEXT_PUBLIC_COGNITO_USER_POOL_ID` / `NEXT_PUBLIC_COGNITO_USER_POOL_ID_DEV`). AWS region still comes from `NEXT_PUBLIC_AWS_REGION`. Tokens are stored in HttpOnly cookies (`bt_at`, `bt_id`, `bt_rt`) by the auth API routes.
- **Mock data:** [`src/mock`](src/mock) supplies transactions, categories, and goals when the backend is unreachable, ensuring consistent demos/offline states.
- **Category spend integration:** normal transaction CRUD uses separate `/api/transactions*` and `/api/categories*` writes to keep `monthlyData.spent` in sync on the frontend, while recurring materialization is expected to update category spend on the backend.

## Commands

| Script                 | Purpose                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Starts Next.js with `--experimental-https` for secure cookies during local auth testing.                                   |
| `npm run dev:dev:ssl`  | Starts the HTTPS dev server against the dev CloudFormation stack by setting `NEXT_PUBLIC_AWS_ENVIRONMENT=dev`.            |
| `npm run dev:prod:ssl` | Starts the HTTPS dev server against the prod CloudFormation stack by setting `NEXT_PUBLIC_AWS_ENVIRONMENT=prod`.          |
| `npm run build`        | Production build.                                                                                                          |
| `npm run start`        | Serve the built app.                                                                                                       |
| `npm run lint`         | ESLint with auto-fix; enforces max 300-line module rule and import sorting per [`eslint.config.mjs`](eslint.config.mjs:9). |
| `npm run prettier:fix` | Format via `.prettierrc` (Tailwind plugin enabled).                                                                        |
| `npm run format`       | Runs Prettier then ESLint fix.                                                                                             |
| `npm run ts:check`     | Type-check only.                                                                                                           |
| `npm run test`         | Runs Vitest unit tests.                                                                                                    |
| `npm run prepare`      | Installs Husky Git hooks (commit hooks are stored under [`.husky`](.husky)).                                               |

## Tooling notes

- **Linting:** Extends `eslint-config-next` (core web vitals + TypeScript). Custom rules enforce max lines, import ordering, and unused-var suppression for `_` prefixes.
- **Formatting:** Prettier prefers single quotes, semicolons, 80-character width, and integrates the Tailwind plugin for class sorting.
- **Package management:** `package-lock.json` is checked in; Vercel builds set `NPM_FLAGS=--legacy-peer-deps` via [`vercel.json`](vercel.json).
- **Testing:** Vitest is configured (`vitest.config.ts` with `@/*` path alias). Unit tests exist for recurrence utilities (`src/utils/recurrence.test.ts`) and recurring-instance deduplication (`src/hooks/use-budget-data/use-recurring-instances.test.ts`). Playwright E2E coverage and broader hook/component tests remain to be added.
- **Documentation:** the current category spend reconciliation contract is captured in [`docs/backend-category-spend-reconciliation.md`](docs/backend-category-spend-reconciliation.md) and should be updated alongside any transaction or recurring-materialization contract changes.

## Deployment & hosting

- Designed for Vercel (default Next.js deployment path). HTTPS dev server mirrors production cookie constraints, so local testing should use `https://localhost:3000`.
- React Query Devtools ship in dev builds via [`QueryProvider`](src/components/QueryProvider/QueryProvider.tsx:35) but remain hidden in production.

## Environment configuration checklist

1. Set the shared AWS region (`NEXT_PUBLIC_AWS_REGION`).
2. Set prod Cognito identifiers (`NEXT_PUBLIC_COGNITO_CLIENT_ID`, `NEXT_PUBLIC_COGNITO_USER_POOL_ID`) because prod is the default environment for builds and for local runs that do not override the selector.
3. Set dev Cognito identifiers (`NEXT_PUBLIC_COGNITO_CLIENT_ID_DEV`, `NEXT_PUBLIC_COGNITO_USER_POOL_ID_DEV`) to use `npm run dev:dev:ssl` against the dev CloudFormation stack.
4. Ensure the external Budget API in each stack trusts tokens from the corresponding Cognito user pool.
5. Trust the local HTTPS certificate generated by `next dev --experimental-https` so browsers send cookies.
6. Align Node version across `.nvmrc`, `package.json`, and CI before running installs/builds.
