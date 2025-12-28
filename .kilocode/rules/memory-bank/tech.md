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

- **External REST API:** `API_BASE_URL` points to an AWS API Gateway endpoint inside [`src/constants/api.ts`](src/constants/api.ts). App Router API routes forward authenticated requests and revalidate cache tags declared in [`src/constants/cache-tags.ts`](src/constants/cache-tags.ts).
- **Authentication:** Cognito client ID and AWS region are read from `NEXT_PUBLIC_COGNITO_CLIENT_ID` and `NEXT_PUBLIC_AWS_REGION`. Tokens are stored in HttpOnly cookies (`bt_at`, `bt_id`, `bt_rt`) by the auth API routes.
- **Mock data:** [`src/mock`](src/mock) supplies transactions, categories, and goals when the backend is unreachable, ensuring consistent demos/offline states.

## Commands

| Script                 | Purpose                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Starts Next.js with `--experimental-https` for secure cookies during local auth testing.                                   |
| `npm run build`        | Production build.                                                                                                          |
| `npm run start`        | Serve the built app.                                                                                                       |
| `npm run lint`         | ESLint with auto-fix; enforces max 300-line module rule and import sorting per [`eslint.config.mjs`](eslint.config.mjs:9). |
| `npm run prettier:fix` | Format via `.prettierrc` (Tailwind plugin enabled).                                                                        |
| `npm run format`       | Runs Prettier then ESLint fix.                                                                                             |
| `npm run ts:check`     | Type-check only.                                                                                                           |
| `npm run prepare`      | Installs Husky Git hooks (commit hooks are stored under [`.husky`](.husky)).                                               |

## Tooling notes

- **Linting:** Extends `eslint-config-next` (core web vitals + TypeScript). Custom rules enforce max lines, import ordering, and unused-var suppression for `_` prefixes.
- **Formatting:** Prettier prefers single quotes, semicolons, 80-character width, and integrates the Tailwind plugin for class sorting.
- **Package management:** `package-lock.json` is checked in; Vercel builds set `NPM_FLAGS=--legacy-peer-deps` via [`vercel.json`](vercel.json).
- **Testing:** No automated test suite yet; add Vitest/Playwright before expanding coverage-sensitive features.

## Deployment & hosting

- Designed for Vercel (default Next.js deployment path). HTTPS dev server mirrors production cookie constraints, so local testing should use `https://localhost:3000`.
- React Query Devtools ship in dev builds via [`QueryProvider`](src/components/QueryProvider/QueryProvider.tsx:35) but remain hidden in production.

## Environment configuration checklist

1. Set the Cognito client ID and AWS region (`NEXT_PUBLIC_COGNITO_CLIENT_ID`, `NEXT_PUBLIC_AWS_REGION`).
2. Provide valid user pool credentials to exercise login/refresh flows.
3. Ensure the external Budget API allows the configured Cognito user pool tokens.
4. Trust the local HTTPS certificate generated by `next dev --experimental-https` so browsers send cookies.
5. Align Node version across `.nvmrc`, `package.json`, and CI before running installs/builds.
