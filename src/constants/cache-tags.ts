const CACHE_TAGS = {
  budget: {
    transactions: 'budget-transactions',
    categories: 'budget-categories',
    goals: 'budget-goals',
  },
  user: {
    preference: 'user-preference',
  },
} as const;

export default CACHE_TAGS;
