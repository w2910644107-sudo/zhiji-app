import { calculateBazi } from "./calculateBazi";

const solarResult = calculateBazi({
  calendarType: "solar",
  year: 2005,
  month: 12,
  day: 23,
  hour: 8,
  gender: "女",
  birthPlace: "杭州",
});

if (solarResult.yearPillar !== "乙酉") {
  throw new Error(`Expected year pillar 乙酉, got ${solarResult.yearPillar}`);
}

if (solarResult.monthPillar !== "戊子") {
  throw new Error(`Expected month pillar 戊子, got ${solarResult.monthPillar}`);
}

if (solarResult.dayPillar !== "辛巳") {
  throw new Error(`Expected day pillar 辛巳, got ${solarResult.dayPillar}`);
}

if (solarResult.hourPillar !== "壬辰") {
  throw new Error(`Expected hour pillar 壬辰, got ${solarResult.hourPillar}`);
}

if (solarResult.dayMaster !== "辛") {
  throw new Error(`Expected day master 辛, got ${solarResult.dayMaster}`);
}

const lunarResult = calculateBazi({
  calendarType: "lunar",
  year: 2019,
  month: 12,
  day: 12,
  hour: 11,
  gender: "男",
  birthPlace: "上海",
});

if (lunarResult.yearPillar !== "己亥") {
  throw new Error(`Expected lunar year pillar 己亥, got ${lunarResult.yearPillar}`);
}

if (lunarResult.hourPillar !== "戊午") {
  throw new Error(`Expected lunar hour pillar 戊午, got ${lunarResult.hourPillar}`);
}
