'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import AddGoalDialog from '../AddGoalDialog';
import { Button } from '@/components/ui/button';

export default function AddGoalButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Goal
      </Button>
      <AddGoalDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
