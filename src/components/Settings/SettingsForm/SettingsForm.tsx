'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useCurrencyPreference } from '@/contexts/currency-context';
import { useBudgetContext } from '@/contexts/budget-context';
import type { CurrencyCode } from '@/types/budget';
import { getCurrencyDisplayMeta } from '@/utils/format-currency';

export default function SettingsForm() {
  const { refetch } = useBudgetContext();
  const {
    preferredCurrency,
    supportedCurrencies,
    updatePreferredCurrency,
    isSaving,
  } = useCurrencyPreference();
  const [selectedCurrency, setSelectedCurrency] =
    useState<CurrencyCode>(preferredCurrency);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSelectedCurrency(preferredCurrency);
  }, [preferredCurrency]);

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

  const handleCurrencyChange = (value: string) => {
    const nextCurrency = value as CurrencyCode;
    setSelectedCurrency(nextCurrency);
    startTransition(async () => {
      try {
        await updatePreferredCurrency(nextCurrency);
        await refetch();
        toast.success('Preferred currency updated');
      } catch (error) {
        console.error(error);
        toast.error('Failed to update preferred currency');
        setSelectedCurrency(preferredCurrency);
      }
    });
  };

  const isUpdatingCurrency = isSaving || isPending;

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Currency Settings</h3>
          <p className="text-muted-foreground text-sm">
            Configure your preferred currency and format.
          </p>
        </div>
        <Separator />
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="currency">Primary Currency</Label>
            <Select
              value={selectedCurrency}
              onValueChange={handleCurrencyChange}
              disabled={isUpdatingCurrency}
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

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </TabsContent>

      <TabsContent value="notifications" className="mt-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Notification Settings</h3>
          <p className="text-muted-foreground text-sm">
            Configure how and when you receive notifications.
          </p>
        </div>
        <Separator />
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="budget-alerts">Budget Alerts</Label>
              <p className="text-muted-foreground text-sm">
                Receive alerts when you approach category limits
              </p>
            </div>
            <Switch id="budget-alerts" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="goal-updates">Goal Updates</Label>
              <p className="text-muted-foreground text-sm">
                Receive updates on your savings goal progress
              </p>
            </div>
            <Switch id="goal-updates" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="monthly-summary">Monthly Summary</Label>
              <p className="text-muted-foreground text-sm">
                Receive a monthly summary of your finances
              </p>
            </div>
            <Switch id="monthly-summary" defaultChecked />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </TabsContent>

      <TabsContent value="appearance" className="mt-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Appearance Settings</h3>
          <p className="text-muted-foreground text-sm">
            Customize the look and feel of your budget tracker.
          </p>
        </div>
        <Separator />
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="theme">Theme</Label>
            <Select defaultValue="system">
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="color-blind">Color Blind Mode</Label>
              <p className="text-muted-foreground text-sm">
                Use color blind friendly palettes for charts
              </p>
            </div>
            <Switch id="color-blind" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-view">Compact View</Label>
              <p className="text-muted-foreground text-sm">
                Use a more compact layout to show more information
              </p>
            </div>
            <Switch id="compact-view" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
