export type LifeProfileInput = {
  calendarType: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  gender: string;
  familyRole: string;
  birthplace: string;
};

export type LifeProfile = LifeProfileInput & {
  createdAt: string;
  bazi: {
    yearPillar: string;
    monthPillar: string;
    dayPillar: string;
    hourPillar: string;
    dayMaster: string;
    heavenlyStems: string[];
    earthlyBranches: string[];
    calendarType: "solar" | "lunar";
  };
  keywords: string[];
  summary: string;
  pillars: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  ziping: Record<string, string>;
  blindSymbols: Record<string, string>;
  ziwei: Record<string, string>;
  luckTimeline: Array<{
    range: string;
    theme: string;
  }>;
  currentStage: string;
  finalReading: string;
};

export type CaseRecord = {
  id: string;
  question: string;
  type: string;
  createdAt: string;
  todayGanzhi?: string;
  verdict: string;
  keyAdvice?: string;
  riskTip?: string;
  lifeView: string;
  todayView: string;
  symbolReading: string;
  liuren: {
    name: string;
    text: string;
  };
  yijing: {
    current: string;
    turnable: string;
    risk: string;
  };
  advice: string[];
  note: string;
};
