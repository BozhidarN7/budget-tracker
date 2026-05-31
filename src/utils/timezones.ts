const DEFAULT_TIMEZONE = 'UTC';

const FALLBACK_TIMEZONES = [
  'UTC',
  'Europe/London',
  'Europe/Sofia',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
] as const;

export type TimezoneOption = {
  value: string;
  label: string;
  searchText: string;
};

function formatTimezoneLabel(timezone: string) {
  if (timezone === DEFAULT_TIMEZONE) {
    return DEFAULT_TIMEZONE;
  }

  return timezone
    .split('/')
    .map((segment) => segment.replace(/_/g, ' '))
    .join(' / ');
}

function getSupportedTimezones() {
  if (typeof Intl.supportedValuesOf !== 'function') {
    return [...FALLBACK_TIMEZONES];
  }

  try {
    const timezones = Intl.supportedValuesOf('timeZone');
    if (!timezones.includes(DEFAULT_TIMEZONE)) {
      return [DEFAULT_TIMEZONE, ...timezones];
    }

    return timezones;
  } catch {
    return [...FALLBACK_TIMEZONES];
  }
}

export function getBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

export function getTimezoneOptions(): TimezoneOption[] {
  return getSupportedTimezones().map((timezone) => ({
    value: timezone,
    label: formatTimezoneLabel(timezone),
    searchText: `${timezone} ${formatTimezoneLabel(timezone)}`.toLowerCase(),
  }));
}

export function normalizeTimezone(timezone?: string | null) {
  return timezone || DEFAULT_TIMEZONE;
}
