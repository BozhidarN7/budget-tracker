'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Edit, MoreHorizontal, Trash } from 'lucide-react';
import EditTransactionDialog from '../EditTransactionDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useBudgetData } from '@/hooks/';
import { cn } from '@/lib/utils';
import { Transaction } from '@/types/budget';

export default function TransactionList() {
  const { transactions } = useBudgetData();
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full',
                      transaction.type === 'income'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
                    )}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                  {transaction.description}
                </div>
              </TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell
                className={cn(
                  'text-right font-medium',
                  transaction.type === 'income'
                    ? 'text-emerald-600'
                    : 'text-rose-600',
                )}
              >
                {transaction.type === 'income' ? '+' : '-'}$
                {transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setEditingTransaction(transaction)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-rose-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingTransaction && (
        <EditTransactionDialog
          transaction={editingTransaction}
          open={!!editingTransaction}
          onOpenChange={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
}
