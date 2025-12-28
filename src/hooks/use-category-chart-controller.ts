'use client';

import { useCallback, useMemo, useState } from 'react';

const DEFAULT_PALETTE = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#0ea5e9',
  '#14b8a6',
  '#f97316',
];

export interface CategoryChartDatum {
  id?: string;
  name: string;
  value: number;
  color?: string;
}

export interface CategoryLegendItem extends CategoryChartDatum {
  rank: number;
  percentage: number;
  isActive: boolean;
}

export interface CategoryChartSlice extends CategoryChartDatum {
  percentage: number;
  isOther?: boolean;
  children?: CategoryChartDatum[];
}

export interface UseCategoryChartControllerOptions {
  primaryCount?: number;
  overflowLabel?: string;
  palette?: string[];
}

export interface UseCategoryChartControllerReturn {
  totalValue: number;
  totalSeriesValue: number;
  displaySeries: CategoryChartSlice[];
  visibleSeries: CategoryChartDatum[];
  legendItems: CategoryLegendItem[];
  filteredLegendItems: CategoryLegendItem[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  toggleCategoryVisibility: (name: string) => void;
  showAllCategories: () => void;
  focusOnTopCategory: () => void;
  isCategoryVisible: (name: string) => boolean;
  hasData: boolean;
  overflowLabel: string;
  sortedSeries: CategoryChartDatum[];
}

export default function useCategoryChartController(
  data: CategoryChartDatum[],
  options: UseCategoryChartControllerOptions = {},
): UseCategoryChartControllerReturn {
  const {
    primaryCount = 6,
    overflowLabel = 'Other categories',
    palette = DEFAULT_PALETTE,
  } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const resolvedPalette = palette.length > 0 ? palette : DEFAULT_PALETTE;

  const sanitizedData = useMemo(() => {
    return data
      .filter((item) => item.value > 0)
      .map((item, index) => ({
        ...item,
        color: item.color ?? resolvedPalette[index % resolvedPalette.length],
      }));
  }, [data, resolvedPalette]);

  const sortedSeries = useMemo(() => {
    return [...sanitizedData].sort((a, b) => b.value - a.value);
  }, [sanitizedData]);

  const normalizedHiddenKeys = useMemo(() => {
    if (hiddenKeys.size === 0) {
      return hiddenKeys;
    }

    const validNames = new Set(sortedSeries.map((item) => item.name));
    const next = new Set<string>();
    hiddenKeys.forEach((key) => {
      if (validNames.has(key) === true) {
        next.add(key);
      }
    });

    return next;
  }, [hiddenKeys, sortedSeries]);

  const visibleSeries = useMemo(() => {
    return sortedSeries.filter(
      (item) => normalizedHiddenKeys.has(item.name) === false,
    );
  }, [sortedSeries, normalizedHiddenKeys]);

  const totalSeriesValue = useMemo(() => {
    return sortedSeries.reduce((sum, item) => sum + item.value, 0);
  }, [sortedSeries]);

  const totalValue = useMemo(() => {
    return visibleSeries.reduce((sum, item) => sum + item.value, 0);
  }, [visibleSeries]);

  const primarySeries = useMemo(() => {
    return visibleSeries.slice(0, primaryCount);
  }, [visibleSeries, primaryCount]);

  const overflowSeries = useMemo(() => {
    return visibleSeries.slice(primaryCount);
  }, [visibleSeries, primaryCount]);

  const overflowValue = useMemo(() => {
    return overflowSeries.reduce((sum, item) => sum + item.value, 0);
  }, [overflowSeries]);

  const displaySeries = useMemo(() => {
    if (totalValue === 0) {
      return [];
    }

    const annotate = (items: CategoryChartDatum[]) => {
      return items.map((item) => ({
        ...item,
        percentage: item.value / totalValue,
      }));
    };

    const baseSlices = annotate(primarySeries);
    if (overflowValue === 0) {
      return baseSlices;
    }

    const overflowColor =
      resolvedPalette[primarySeries.length % resolvedPalette.length];
    return [
      ...baseSlices,
      {
        name: overflowLabel,
        value: overflowValue,
        color: overflowColor,
        percentage: overflowValue / totalValue,
        isOther: true,
        children: overflowSeries,
      },
    ];
  }, [
    primarySeries,
    overflowSeries,
    overflowLabel,
    overflowValue,
    resolvedPalette,
    totalValue,
  ]);

  const legendItems = useMemo(() => {
    return sortedSeries.map((item, index) => ({
      ...item,
      rank: index + 1,
      percentage: totalSeriesValue === 0 ? 0 : item.value / totalSeriesValue,
      isActive: normalizedHiddenKeys.has(item.name) === false,
    }));
  }, [sortedSeries, totalSeriesValue, normalizedHiddenKeys]);

  const filteredLegendItems = useMemo(() => {
    if (searchQuery.trim() === '') {
      return legendItems;
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    return legendItems.filter((item) =>
      item.name.toLowerCase().includes(normalizedQuery),
    );
  }, [legendItems, searchQuery]);

  const isCategoryVisible = useCallback(
    (name: string) => {
      return normalizedHiddenKeys.has(name) === false;
    },
    [normalizedHiddenKeys],
  );

  const toggleCategoryVisibility = useCallback(
    (name: string) => {
      setHiddenKeys((prev) => {
        const validNames = new Set(sortedSeries.map((item) => item.name));
        const next = new Set<string>();
        prev.forEach((key) => {
          if (validNames.has(key) === true) {
            next.add(key);
          }
        });

        const currentlyVisible = next.has(name) === false;
        if (currentlyVisible === true) {
          const visibleCount = sortedSeries.length - next.size;
          if (visibleCount <= 1) {
            return next;
          }
          next.add(name);
          return next;
        }

        next.delete(name);
        return next;
      });
    },
    [sortedSeries],
  );

  const showAllCategories = useCallback(() => {
    setHiddenKeys(new Set());
  }, []);

  const focusOnTopCategory = useCallback(() => {
    setHiddenKeys(() => {
      if (sortedSeries.length <= 1) {
        return new Set();
      }

      const next = new Set<string>();
      for (let index = 1; index < sortedSeries.length; index += 1) {
        next.add(sortedSeries[index].name);
      }
      return next;
    });
  }, [sortedSeries]);

  return {
    totalValue,
    totalSeriesValue,
    displaySeries,
    visibleSeries,
    legendItems,
    filteredLegendItems,
    searchQuery,
    setSearchQuery,
    toggleCategoryVisibility,
    showAllCategories,
    focusOnTopCategory,
    isCategoryVisible,
    hasData: totalSeriesValue > 0,
    overflowLabel,
    sortedSeries,
  };
}
