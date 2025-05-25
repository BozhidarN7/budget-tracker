import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import RouteGuard from '@/components/Auth/RouteGuard';
import ConditionalBudgetProvider from '@/components/ConditionalBugdetProvider';
import { AuthProvider } from '@/contexts';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Budget Tracker',
  description: 'Track your income, expenses, and savings goals',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <RouteGuard>
              <ConditionalBudgetProvider>
                <div className="flex min-h-screen flex-col md:flex-row">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main className="container mx-auto p-4 md:p-6">
                      {children}
                    </main>
                  </div>
                </div>
                <Toaster />
              </ConditionalBudgetProvider>
            </RouteGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
