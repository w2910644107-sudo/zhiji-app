"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { CaseRecord, LifeProfile } from "./types";
import { resetUsageStats } from "./usage";

const LIFE_KEY = "zhiji.lifeProfile";
const CASES_KEY = "zhiji.caseRecords";
const PREFERENCES_KEY = "zhiji.preferences";
const TODAY_VIEWED_KEY = "zhiji.todayViewed";
const EMPTY_CASES: CaseRecord[] = [];
const snapshotCache = new Map<string, { raw: string | null; value: unknown }>();

export type UserPreferences = {
  resultMode: "简明" | "详细";
  copyStyle: "克制" | "古风" | "直白";
  homeEntry: "今日" | "问事";
};

export const defaultPreferences: UserPreferences = {
  resultMode: "简明",
  copyStyle: "克制",
  homeEntry: "今日",
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    const cached = snapshotCache.get(key);
    if (cached && cached.raw === raw) {
      return cached.value as T;
    }

    const value = raw ? (JSON.parse(raw) as T) : fallback;
    snapshotCache.set(key, { raw, value });
    return value;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  snapshotCache.delete(key);
  window.dispatchEvent(new Event(`${key}:change`));
}

function removeKey(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
  snapshotCache.delete(key);
  window.dispatchEvent(new Event(`${key}:change`));
}

function subscribeKey(key: string, callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === key) {
      callback();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(`${key}:change`, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(`${key}:change`, callback);
  };
}

export function useLifeProfile() {
  const profile = useSyncExternalStore(
    (callback) => subscribeKey(LIFE_KEY, callback),
    () => readJson<LifeProfile | null>(LIFE_KEY, null),
    () => null,
  );

  const saveProfile = useCallback((next: LifeProfile) => {
    writeJson(LIFE_KEY, next);
  }, []);

  const clearProfile = useCallback(() => {
    removeKey(LIFE_KEY);
  }, []);

  return { profile, ready: true, saveProfile, clearProfile };
}

export function useCaseRecords() {
  const records = useSyncExternalStore(
    (callback) => subscribeKey(CASES_KEY, callback),
    () => readJson<CaseRecord[]>(CASES_KEY, EMPTY_CASES),
    () => EMPTY_CASES,
  );

  const saveRecord = useCallback((record: CaseRecord) => {
    const current = readJson<CaseRecord[]>(CASES_KEY, []);
    writeJson(CASES_KEY, [record, ...current]);
  }, []);

  const clearRecords = useCallback(() => {
    removeKey(CASES_KEY);
  }, []);

  const deleteRecord = useCallback((id: string) => {
    const current = readJson<CaseRecord[]>(CASES_KEY, []);
    writeJson(
      CASES_KEY,
      current.filter((record) => record.id !== id),
    );
  }, []);

  return { records, ready: true, saveRecord, clearRecords, deleteRecord };
}

export function useUserPreferences() {
  const preferences = useSyncExternalStore(
    (callback) => subscribeKey(PREFERENCES_KEY, callback),
    () => readJson<UserPreferences>(PREFERENCES_KEY, defaultPreferences),
    () => defaultPreferences,
  );

  const savePreferences = useCallback((next: UserPreferences) => {
    writeJson(PREFERENCES_KEY, next);
  }, []);

  const resetPreferences = useCallback(() => {
    writeJson(PREFERENCES_KEY, defaultPreferences);
  }, []);

  return { preferences, savePreferences, resetPreferences };
}

export function useTodayViewed() {
  const viewed = useSyncExternalStore(
    (callback) => subscribeKey(TODAY_VIEWED_KEY, callback),
    () => readJson<boolean>(TODAY_VIEWED_KEY, false),
    () => false,
  );

  const markViewed = useCallback(() => {
    writeJson(TODAY_VIEWED_KEY, true);
  }, []);

  return { viewed, markViewed };
}

export function resetAllZhijiData() {
  removeKey(LIFE_KEY);
  removeKey(CASES_KEY);
  removeKey(PREFERENCES_KEY);
  removeKey(TODAY_VIEWED_KEY);
  resetUsageStats();
}
