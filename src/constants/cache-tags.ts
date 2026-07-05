const CACHE_TAGS = {
  budget: {
    transactions: 'budget-transactions',
    recurringTransactions: 'budget-recurring-transactions',
    categories: 'budget-categories',
    goals: 'budget-goals',
    allTransactions: 'budget-all-transactions',
  },
  user: {
    preference: 'user-preference',
  },
} as const;

export default CACHE_TAGS;
