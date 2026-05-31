'use client';

import GeneralSettingsTab from './GeneralSettingsTab';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsForm() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralSettingsTab />
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
