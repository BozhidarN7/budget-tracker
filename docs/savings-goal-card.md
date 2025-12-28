## Savings Goal Card

### Purpose

Surface real-time savings progress for the "Monthly" goal and communicate how income and expense totals impact monthly savings capacity. The component lives at [`src/components/Goals/SavingsGoalCard/SavingsGoalCard.tsx`](src/components/Goals/SavingsGoalCard/SavingsGoalCard.tsx) and is rendered on the goals route via [`src/app/(dashboard)/goals/page.tsx`](<src/app/(dashboard)/goals/page.tsx>).

### Data contract

- Consumes `primaryGoal`, `savingsGoal`, `currentSavings`, `savingsProgress`, and `savingsBreakdown` from [`useBudgetData()`](src/hooks/use-budget-data.ts:11).
- `primaryGoal` is derived by matching a goal whose name contains "Monthly" (case-insensitive). When no such record exists, the card renders an empty state that links to [`AddGoalButton`](src/components/Goals/AddGoalButton/AddGoalButton.tsx).
- When the backend lacks a record for the current month, [`useBudgetData()`](src/hooks/use-budget-data.ts:11) automatically provisions a new monthly goal (copies the previous month's target, resets `current` to `0`, and stamps the selected month as the `targetDate`).
- `EditGoalDialog` is embedded inside the card so edits persist through [`useBudgetContext()`](src/contexts/budget-context.tsx:199) without leaving the page.

### UX states

1. **Loading** – Skeleton surfaces when `useBudgetData()` reports `isLoading`.
2. **Empty** – Encourages creation of the monthly goal with contextual copy and the add button.
3. **Populated** – Shows goal name, target date, progress bar, formatted amounts, and a monthly income/expense breakdown.

### Recommended placements

- **Goals page hero** (current): provides context before the grid of long-term goals.
- **Dashboard summary** via [`SavingsGoalProgress`](src/components/Dashboard/SavingsGoalProgress/SavingsGoalProgress.tsx) for a compact variant.
- **Mobile drawer or notification center** as a quick reminder to adjust the goal when savings stagnate.

### Authoring notes

- Ensure the backend (or mock data) contains a "Monthly" goal so the component can highlight the correct record.
- Edits only mutate the specific month record shown in the card, so historical monthly goals stay immutable unless explicitly opened via the goals list.
- Month switching is handled upstream by the budget context; consumers only need to render the card.
- When duplicating the card into new surfaces, prefer importing the component instead of recreating the data glue so analytics and copy stay in sync.
