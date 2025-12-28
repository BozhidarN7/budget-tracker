'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCurrencyFormatter } from '@/hooks/';
import { CategoryLegendItem } from '@/hooks/use-category-chart-controller';
import { formatPercentage } from '@/utils';

interface DetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CategoryLegendItem[];
  onToggle?: (name: string) => void;
  onSelectAll?: () => void;
  onSoloTopCategory?: () => void;
}

export default function DetailsDialog({
  open,
  onOpenChange,
  items,
  onToggle,
  onSelectAll,
  onSoloTopCategory,
}: DetailsDialogProps) {
  const { formatCurrency } = useCurrencyFormatter();
  const hasBulkActions = onSelectAll != null || onSoloTopCategory != null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>All categories</DialogTitle>
          <DialogDescription>
            Review every expense category, including totals and their share of
            the selected month.
          </DialogDescription>
        </DialogHeader>

        {hasBulkActions ? (
          <div className="border-border/60 bg-muted/40 text-muted-foreground flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2 text-xs">
            <span className="text-foreground text-sm font-medium">
              Visibility shortcuts
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {onSelectAll ? (
                <Button variant="outline" size="sm" onClick={onSelectAll}>
                  Show all
                </Button>
              ) : null}
              {onSoloTopCategory ? (
                <Button variant="outline" size="sm" onClick={onSoloTopCategory}>
                  Solo top category
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="max-h-[420px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">#</TableHead>
                <TableHead scope="col">Category</TableHead>
                <TableHead scope="col" className="text-right">
                  Amount
                </TableHead>
                <TableHead scope="col" className="text-right">
                  Share
                </TableHead>
                {onToggle ? (
                  <TableHead scope="col" className="text-right">
                    Visible
                  </TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-semibold">{item.rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.value)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercentage(item.percentage)}
                  </TableCell>
                  {onToggle ? (
                    <TableCell className="text-right">
                      <Switch
                        checked={item.isActive}
                        onCheckedChange={() => onToggle(item.name)}
                        aria-label={`Toggle visibility for ${item.name}`}
                      />
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
