'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import AddTransactionDialog from '../AddTransactionDialog';
import { Button } from '@/components/ui/button';

export default function AddTransactionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Transaction
      </Button>
      <AddTransactionDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
