import type { BaziResult } from "./calculateBazi";

export type DayImpactInput = {
  todayStem: string;
  todayBranch: string;
  userBazi: {
    yearPillar: string;
    monthPillar: string;
    dayPillar: string;
    hourPillar: string;
    dayMaster: string;
    stems: string[];
    branches: string[];
  };
  usefulGods?: string[];
  avoidGods?: string[];
};

export type DayImpactResult = {
  tenGodOfTodayStem: string;
  branchRelations: string[];
  touchedAreas: string[];
  personalImpact: string;
  suggestedActions: string[];
  avoidActions: string[];
  reasoning: string[];
};

const stemElement: Record<string, string> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

const stemYinYang: Record<string, "yang" | "yin"> = {
  甲: "yang",
  乙: "yin",
  丙: "yang",
  丁: "yin",
  戊: "yang",
  己: "yin",
  庚: "yang",
  辛: "yin",
  壬: "yang",
  癸: "yin",
};

const generating: Record<string, string> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};

const controlling: Record<string, string> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

const branchAreas = ["外部环境、家族背景、远方资源", "事业环境、上级规则、工作节奏", "自身状态、关系核心、眼前决定", "计划结果、长期方向、后续安排"];

const branchRelationPairs = {
  六合: ["子丑", "寅亥", "卯戌", "辰酉", "巳申", "午未"],
  六冲: ["子午", "丑未", "寅申", "卯酉", "辰戌", "巳亥"],
  六害: ["子未", "丑午", "寅巳", "卯辰", "申亥", "酉戌"],
};

const tenGodMeaning: Record<string, string> = {
  财星: "钱、资源、现实条件、交易与收益",
  官杀: "规则、压力、责任、上级、职位与约束",
  印星: "学习、文书、贵人、保护与修复",
  食伤: "表达、输出、技术、创作与沟通",
  比劫: "朋友、竞争、自我与资源分配",
};

export function toUserBazi(result: BaziResult) {
  return {
    yearPillar: result.yearPillar,
    monthPillar: result.monthPillar,
    dayPillar: result.dayPillar,
    hourPillar: result.hourPillar,
    dayMaster: result.dayMaster,
    stems: result.heavenlyStems,
    branches: result.earthlyBranches,
  };
}

export function getTenGodGroup(dayMaster: string, otherStem: string) {
  const dayElement = stemElement[dayMaster];
  const otherElement = stemElement[otherStem];

  if (!dayElement || !otherElement) {
    return "比劫";
  }

  if (otherElement === dayElement) {
    return "比劫";
  }

  if (generating[dayElement] === otherElement) {
    return "食伤";
  }

  if (generating[otherElement] === dayElement) {
    return "印星";
  }

  if (controlling[dayElement] === otherElement) {
    return "财星";
  }

  return "官杀";
}

export function getTenGodName(dayMaster: string, otherStem: string) {
  const group = getTenGodGroup(dayMaster, otherStem);
  const samePolarity = stemYinYang[dayMaster] === stemYinYang[otherStem];

  if (group === "比劫") {
    return samePolarity ? "比肩" : "劫财";
  }
  if (group === "食伤") {
    return samePolarity ? "食神" : "伤官";
  }
  if (group === "财星") {
    return samePolarity ? "偏财" : "正财";
  }
  if (group === "官杀") {
    return samePolarity ? "七杀" : "正官";
  }

  return samePolarity ? "偏印" : "正印";
}

export function getBranchRelations(todayBranch: string, branches: string[]) {
  const relations: string[] = [];

  branches.forEach((branch, index) => {
    Object.entries(branchRelationPairs).forEach(([name, pairs]) => {
      const matched = pairs.some((pair) => pair.includes(todayBranch) && pair.includes(branch));
      if (matched) {
        relations.push(`${name}触动${branchAreas[index]}：${todayBranch}${branch}`);
      }
    });
  });

  if (todayBranch === "子" && branches.includes("卯")) {
    relations.push("子卯刑：沟通与关系边界需更清楚。");
  }
  if (["寅", "巳", "申"].includes(todayBranch) && ["寅", "巳", "申"].some((item) => branches.includes(item))) {
    relations.push("寅巳申三刑见动象：不宜在压力中仓促定局。");
  }
  if (["丑", "戌", "未"].includes(todayBranch) && ["丑", "戌", "未"].some((item) => branches.includes(item))) {
    relations.push("丑戌未三刑见土气纠结：先整理责任与承诺。");
  }

  return Array.from(new Set(relations));
}

export function calculateDayImpact(input: DayImpactInput): DayImpactResult {
  const tenGodName = getTenGodName(input.userBazi.dayMaster, input.todayStem);
  const tenGodGroup = getTenGodGroup(input.userBazi.dayMaster, input.todayStem);
  const branchRelations = getBranchRelations(input.todayBranch, input.userBazi.branches);
  const touchedAreas = input.userBazi.branches
    .map((branch, index) => (branchRelations.some((relation) => relation.includes(branch)) ? branchAreas[index] : null))
    .filter((item): item is string => Boolean(item));
  const usefulHit = input.usefulGods?.some((god) => god === stemElement[input.todayStem] || god === tenGodGroup);

  return {
    tenGodOfTodayStem: `${tenGodName}（${tenGodGroup}）`,
    branchRelations,
    touchedAreas: Array.from(new Set(touchedAreas)),
    personalImpact: `今日天干对你日主形成${tenGodName}，主${tenGodMeaning[tenGodGroup]}。${
      branchRelations.length ? "地支有触动，宜先看清对应人事位置。" : "地支触动较轻，适合按原计划稳步推进。"
    }${usefulHit ? "今日之气与当前取用方向相合，可主动推进一小步。" : ""}`,
    suggestedActions: buildSuggestedActions(tenGodGroup),
    avoidActions: buildAvoidActions(tenGodGroup),
    reasoning: [
      `日主为${input.userBazi.dayMaster}，今日天干${input.todayStem}为${tenGodName}。`,
      branchRelations.length ? `今日地支${input.todayBranch}与命局地支见${branchRelations.join("；")}。` : `今日地支${input.todayBranch}未见明显冲合刑害。`,
    ],
  };
}

function buildSuggestedActions(group: string) {
  if (group === "财星") return ["核对成本与收益", "确认资源与条件", "先做小额验证"];
  if (group === "官杀") return ["整理责任边界", "遵守流程", "把承诺写清"];
  if (group === "印星") return ["补资料", "请教可信人士", "修复遗漏"];
  if (group === "食伤") return ["表达想法", "输出作品", "主动沟通"];
  return ["稳住节奏", "分配资源", "避免硬碰"];
}

function buildAvoidActions(group: string) {
  if (group === "财星") return ["重仓投入", "只听收益不看风险"];
  if (group === "官杀") return ["对抗规则", "仓促承诺"];
  if (group === "印星") return ["信息不足就定案", "忽略文书细节"];
  if (group === "食伤") return ["情绪化表达", "夸口过满"];
  return ["争抢资源", "意气用事"];
}
