'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getTimezoneOptions } from '@/utils/timezones';

type TimezoneSelectProps = {
  browserTimezone: string;
  descriptionId: string;
  disabled: boolean;
  onChange: (timezone: string) => void;
  value: string;
};

export default function TimezoneSelect({
  browserTimezone,
  descriptionId,
  disabled,
  onChange,
  value,
}: TimezoneSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const timezoneOptions = useMemo(() => getTimezoneOptions(), []);

  const selectedTimezoneOption =
    timezoneOptions.find((option) => option.value === value) ??
    timezoneOptions[0];

  const filteredTimezoneOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return timezoneOptions;
    }

    return timezoneOptions.filter((option) => {
      return option.searchText.includes(normalizedSearch);
    });
  }, [search, timezoneOptions]);

  return (
    <div className="grid gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Label htmlFor="timezone-trigger">Timezone</Label>
          <p id={descriptionId} className="text-muted-foreground text-sm">
            Recurring transactions use this timezone to decide what is due
            today.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            onChange(browserTimezone);
          }}
          disabled={disabled}
        >
          Use current timezone
        </Button>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="timezone-trigger"
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-describedby={descriptionId}
            className="w-full justify-between"
            disabled={disabled}
          >
            <span className="truncate">
              {selectedTimezoneOption?.value ?? value}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Search timezone..."
            />
            <CommandList>
              {filteredTimezoneOptions.length === 0 ? (
                <CommandEmpty>No timezones found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredTimezoneOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      aria-selected={option.value === value}
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                        setSearch('');
                      }}
                    >
                      <Check
                        className={cn(
                          'h-4 w-4',
                          option.value === value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{option.value}</p>
                        <p className="text-muted-foreground truncate text-xs">
                          {option.label}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-muted-foreground text-sm">
        Browser detected: <span className="font-medium">{browserTimezone}</span>
      </p>
    </div>
  );
}
