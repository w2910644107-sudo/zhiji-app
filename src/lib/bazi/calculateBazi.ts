import type { LifeProfileInput } from "../types";

const { Solar, Lunar } = require("lunar-javascript");

export type BaziCalendarType = "solar" | "lunar";

export type CalculateBaziInput = {
  calendarType: BaziCalendarType;
  year: number;
  month: number;
  day: number;
  hour: number | string;
  gender: string;
  birthPlace: string;
};

export type BaziResult = {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  dayMaster: string;
  heavenlyStems: string[];
  earthlyBranches: string[];
  calendarType: BaziCalendarType;
};

const hourBranchToSolarHour: Record<string, number> = {
  子: 0,
  丑: 2,
  寅: 4,
  卯: 6,
  辰: 8,
  巳: 10,
  午: 12,
  未: 14,
  申: 16,
  酉: 18,
  戌: 20,
  亥: 22,
};

export function normalizeCalendarType(calendarType: string): BaziCalendarType {
  return calendarType === "lunar" || calendarType === "阴历" ? "lunar" : "solar";
}

export function parseBirthHour(hour: number | string): number {
  if (typeof hour === "number" && Number.isFinite(hour)) {
    return clampHour(hour);
  }

  const raw = String(hour || "").trim();
  const branch = Object.keys(hourBranchToSolarHour).find((item) => raw.includes(item));
  if (branch) {
    return hourBranchToSolarHour[branch];
  }

  const numeric = Number(raw.replace(/[^\d.-]/g, ""));
  return Number.isFinite(numeric) ? clampHour(numeric) : 0;
}

export function calculateBazi(input: CalculateBaziInput): BaziResult {
  const year = safePositiveInteger(input.year, 1990);
  const month = safePositiveInteger(input.month, 1);
  const day = safePositiveInteger(input.day, 1);
  const hour = parseBirthHour(input.hour);
  const calendarType = normalizeCalendarType(input.calendarType);
  const lunar =
    calendarType === "lunar"
      ? Lunar.fromYmdHms(year, month, day, hour, 0, 0)
      : Solar.fromYmdHms(year, month, day, hour, 0, 0).getLunar();
  const eightChar = lunar.getEightChar();
  const pillars = [eightChar.getYear(), eightChar.getMonth(), eightChar.getDay(), eightChar.getTime()];

  return {
    yearPillar: pillars[0],
    monthPillar: pillars[1],
    dayPillar: pillars[2],
    hourPillar: pillars[3],
    dayMaster: pillars[2].slice(0, 1),
    heavenlyStems: pillars.map((pillar) => pillar.slice(0, 1)),
    earthlyBranches: pillars.map((pillar) => pillar.slice(1, 2)),
    calendarType,
  };
}

export function calculateBaziFromLifeProfileInput(input: LifeProfileInput): BaziResult {
  return calculateBazi({
    calendarType: normalizeCalendarType(input.calendarType),
    year: Number(input.birthYear),
    month: Number(input.birthMonth),
    day: Number(input.birthDay),
    hour: input.birthHour,
    gender: input.gender,
    birthPlace: input.birthplace,
  });
}

function safePositiveInteger(value: number, fallback: number) {
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : fallback;
}

function clampHour(value: number) {
  return Math.max(0, Math.min(23, Math.trunc(value)));
}
