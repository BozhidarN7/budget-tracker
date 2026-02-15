'use client';

import { useState } from 'react';
import { Repeat } from 'lucide-react';
import AddRecurringTransactionDialog from '../AddRecurringTransactionDialog/AddRecurringTransactionDialog';
import { Button } from '@/components/ui/button';

export default function AddRecurringTransactionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Repeat className="mr-2 h-4 w-4" />
        Recurring Series
      </Button>
      <AddRecurringTransactionDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
