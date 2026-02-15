'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Edit,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Trash,
} from 'lucide-react';
import EditRecurringTransactionDialog from '../EditRecurringTransactionDialog';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useBudgetContext } from '@/contexts/budget-context';
import { useCurrencyFormatter } from '@/hooks/';
import type { RecurringTransaction } from '@/types/budget';
import { cn } from '@/lib/utils';

const statusClassMap: Record<
  NonNullable<RecurringTransaction['status']>,
  string
> = {
  active: 'text-emerald-600',
  paused: 'text-amber-600',
  completed: 'text-muted-foreground',
};

export default function RecurringTransactionList() {
  const {
    recurringTransactions,
    removeRecurringTransaction,
    updateRecurringTransaction,
  } = useBudgetContext();
  const { formatCurrency } = useCurrencyFormatter();
  const [editingTransaction, setEditingTransaction] =
    useState<RecurringTransaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasData = recurringTransactions.length > 0;

  const sortedTransactions = useMemo(() => {
    return [...recurringTransactions].sort((a, b) =>
      a.description.localeCompare(b.description),
    );
  }, [recurringTransactions]);

  const handleDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      await removeRecurringTransaction(deletingId);
      toast.success('Recurring series deleted');
    } catch (_error) {
      toast.error('Failed to delete recurring series');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (transaction: RecurringTransaction) => {
    const nextStatus = transaction.status === 'paused' ? 'active' : 'paused';
    try {
      await updateRecurringTransaction(transaction.id, { status: nextStatus });
      toast.success('Recurring series updated');
    } catch (_error) {
      toast.error('Failed to update recurring series');
    }
  };

  if (!hasData) {
    return (
      <div className="rounded-lg border shadow-sm">
        <div className="flex h-32 items-center justify-center">
          <p className="text-muted-foreground text-sm">
            No recurring series yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Next occurrence</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {transaction.description}
              </TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell className="capitalize">
                {transaction.rule.frequency}
              </TableCell>
              <TableCell>{transaction.nextOccurrence}</TableCell>
              <TableCell
                className={cn(
                  'capitalize',
                  statusClassMap[transaction.status ?? 'active'],
                )}
              >
                {transaction.status ?? 'active'}
              </TableCell>
              <TableCell
                className={cn(
                  'text-right font-medium',
                  transaction.type === 'income'
                    ? 'text-emerald-600'
                    : 'text-rose-600',
                )}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
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
                    <DropdownMenuItem
                      onClick={() => handleToggleStatus(transaction)}
                    >
                      {transaction.status === 'paused' ? (
                        <PlayCircle className="mr-2 h-4 w-4" />
                      ) : (
                        <PauseCircle className="mr-2 h-4 w-4" />
                      )}
                      {transaction.status === 'paused' ? 'Resume' : 'Pause'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-rose-600"
                      onClick={() => setDeletingId(transaction.id)}
                    >
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
        <EditRecurringTransactionDialog
          transaction={editingTransaction}
          open={!!editingTransaction}
          onOpenChange={() => setEditingTransaction(null)}
        />
      )}

      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete recurring series?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Future occurrences will no longer be
              generated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
