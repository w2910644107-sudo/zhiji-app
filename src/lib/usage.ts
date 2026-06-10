"use client";

import { useSyncExternalStore } from "react";

const USAGE_KEY = "zhiji.usageStats";

export type UsageStats = {
  date: string;
  todayVisits: number;
  todayViews: number;
  todayAsks: number;
  totalAsks: number;
  totalCases: number;
  adjustViews: number;
  lifeViews: number;
  lastVisitAt: string | null;
};

const defaultUsage: UsageStats = {
  date: todayKey(),
  todayVisits: 0,
  todayViews: 0,
  todayAsks: 0,
  totalAsks: 0,
  totalCases: 0,
  adjustViews: 0,
  lifeViews: 0,
  lastVisitAt: null,
};

export function recordVisit() {
  updateUsage((stats) => ({
    ...stats,
    todayVisits: stats.todayVisits + 1,
    lastVisitAt: new Date().toISOString(),
  }));
}

export function recordTodayView() {
  updateUsage((stats) => ({ ...stats, todayViews: stats.todayViews + 1 }));
}

export function recordAsk() {
  updateUsage((stats) => ({
    ...stats,
    todayAsks: stats.todayAsks + 1,
    totalAsks: stats.totalAsks + 1,
  }));
}

export function recordCaseCreated() {
  updateUsage((stats) => ({ ...stats, totalCases: stats.totalCases + 1 }));
}

export function recordAdjustView() {
  updateUsage((stats) => ({ ...stats, adjustViews: stats.adjustViews + 1 }));
}

export function recordLifeView() {
  updateUsage((stats) => ({ ...stats, lifeViews: stats.lifeViews + 1 }));
}

export function getUsageStats() {
  return readUsage();
}

export function resetUsageStats() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(USAGE_KEY);
  window.dispatchEvent(new Event(`${USAGE_KEY}:change`));
}

export function useUsageStats() {
  return useSyncExternalStore(subscribeUsage, readUsage, () => defaultUsage);
}

function updateUsage(updater: (stats: UsageStats) => UsageStats) {
  if (typeof window === "undefined") {
    return;
  }

  const next = updater(readUsage());
  window.localStorage.setItem(USAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(`${USAGE_KEY}:change`));
}

function readUsage(): UsageStats {
  if (typeof window === "undefined") {
    return defaultUsage;
  }

  try {
    const raw = window.localStorage.getItem(USAGE_KEY);
    const parsed = raw ? ({ ...defaultUsage, ...JSON.parse(raw) } as UsageStats) : defaultUsage;
    const currentDate = todayKey();

    if (parsed.date !== currentDate) {
      return {
        ...parsed,
        date: currentDate,
        todayVisits: 0,
        todayViews: 0,
        todayAsks: 0,
      };
    }

    return parsed;
  } catch {
    return defaultUsage;
  }
}

function subscribeUsage(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === USAGE_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(`${USAGE_KEY}:change`, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(`${USAGE_KEY}:change`, callback);
  };
}

function todayKey() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
