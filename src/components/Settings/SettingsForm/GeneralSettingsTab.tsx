'use client';

import { useEffect, useId, useMemo, useState, useTransition } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import TimezoneSelect from './TimezoneSelect';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useBudgetContext } from '@/contexts/budget-context';
import { useCurrencyPreference } from '@/contexts/currency-context';
import { cn } from '@/lib/utils';
import type { CurrencyCode } from '@/types/budget';
import { getCurrencyDisplayMeta } from '@/utils/format-currency';
import { getBrowserTimezone, normalizeTimezone } from '@/utils/timezones';

export default function GeneralSettingsTab() {
  const { refetch, materializeRecurringTransactions } = useBudgetContext();
  const {
    preferredCurrency,
    supportedCurrencies,
    timezone,
    savePreference,
    refreshPreference,
    isSaving,
  } = useCurrencyPreference();
  const [selectedCurrency, setSelectedCurrency] =
    useState<CurrencyCode>(preferredCurrency);
  const [selectedTimezone, setSelectedTimezone] = useState(
    normalizeTimezone(timezone),
  );
  const [isPending, startTransition] = useTransition();
  const [isSyncPending, startSyncTransition] = useTransition();
  const timezoneDescriptionId = useId();

  useEffect(() => {
    setSelectedCurrency(preferredCurrency);
  }, [preferredCurrency]);

  useEffect(() => {
    setSelectedTimezone(normalizeTimezone(timezone));
  }, [timezone]);

  const browserTimezone = useMemo(() => getBrowserTimezone(), []);

  const currencyOptions = useMemo(() => {
    return supportedCurrencies.map((code) => {
      const meta = getCurrencyDisplayMeta(code);

      return {
        code,
        label:
          meta.position === 'before'
            ? `${meta.symbol} - ${code}`
            : `${code} - ${meta.symbol}`,
      };
    });
  }, [supportedCurrencies]);

  const hasChanges =
    selectedCurrency !== preferredCurrency ||
    selectedTimezone !== normalizeTimezone(timezone);
  const isSubmitting = isSaving || isPending;

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        await savePreference({
          preferredCurrency: selectedCurrency,
          timezone: selectedTimezone,
        });
        await refreshPreference();
        await refetch();
        toast.success('Preferences updated');
      } catch (error) {
        console.error(error);
        toast.error('Failed to update preferences');
      }
    });
  };

  const handleSyncRecurring = () => {
    startSyncTransition(async () => {
      try {
        await materializeRecurringTransactions();
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Currency Settings</h3>
        <p className="text-muted-foreground text-sm">
          Configure your preferred currency and the timezone used for recurring
          transaction due dates.
        </p>
      </div>
      <Separator />
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="currency">Primary Currency</Label>
          <Select
            value={selectedCurrency}
            onValueChange={(value) => {
              setSelectedCurrency(value as CurrencyCode);
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((option) => (
                <SelectItem key={option.code} value={option.code}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TimezoneSelect
          browserTimezone={browserTimezone}
          descriptionId={timezoneDescriptionId}
          disabled={isSubmitting}
          onChange={setSelectedTimezone}
          value={selectedTimezone}
        />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="multi-currency">Multi-Currency Support</Label>
            <p className="text-muted-foreground text-sm">
              Track expenses in different currencies
            </p>
          </div>
          <Switch id="multi-currency" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Budget Period</h3>
        <p className="text-muted-foreground text-sm">
          Set your preferred budget tracking period.
        </p>
      </div>
      <Separator />
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="period">Budget Period</Label>
          <Select defaultValue="monthly">
            <SelectTrigger id="period">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="start-day">Start Day of Month</Label>
          <Select defaultValue="1">
            <SelectTrigger id="start-day">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Data Synchronization</h3>
        <p className="text-muted-foreground text-sm">
          Manually trigger catch-up of any due recurring transactions.
        </p>
      </div>
      <Separator />
      <div className="grid gap-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Recurring transactions</p>
            <p className="text-muted-foreground text-sm">
              Generate transactions from active recurring rules
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleSyncRecurring}
            disabled={isSyncPending}
            aria-busy={isSyncPending}
          >
            <RefreshCw
              aria-hidden="true"
              className={cn('mr-2 h-4 w-4', isSyncPending && 'animate-spin')}
            />
            <span aria-live="polite">
              {isSyncPending ? 'Syncing...' : 'Sync now'}
            </span>
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!hasChanges || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
