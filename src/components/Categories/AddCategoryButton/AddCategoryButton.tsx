'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import AddCategoryDialog from '../AddCategoryDialog';
import { Button } from '@/components/ui/button';

export default function AddCategoryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Category
      </Button>
      <AddCategoryDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
