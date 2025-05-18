import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { fetchTransactions } from '@/api/budget-tracker-api/transactions';
import { fetchGoals } from '@/api/budget-tracker-api/goals';
import { fetchCategories } from '@/api/budget-tracker-api/categories';
import { BudgetProvider } from '@/contexts';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Budget Tracker',
  description: 'Track your income, expenses, and savings goals',
};

async function getData() {
  try {
    const [transactions, categories, goals] = await Promise.all([
      fetchTransactions(),
      fetchCategories(),
      fetchGoals(),
    ]);

    return { transactions, categories, goals };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return { transactions: [], categories: [], goals: [] };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { transactions, categories, goals } = await getData();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BudgetProvider
            initialTransactions={transactions}
            initialCategories={categories}
            initialGoals={goals}
          >
            <div className="flex min-h-screen flex-col md:flex-row">
              <Sidebar />
              <div className="flex-1">
                <Header />
                <main className="container mx-auto p-4 md:p-6">{children}</main>
              </div>
            </div>
            <Toaster />
          </BudgetProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
