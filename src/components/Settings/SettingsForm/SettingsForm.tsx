'use client';

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

export default function SettingsForm() {
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
            <Select defaultValue="bgn">
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bgn">BGN (лв)</SelectItem>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
                <SelectItem value="jpy">JPY (¥)</SelectItem>
                <SelectItem value="cad">CAD ($)</SelectItem>
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
