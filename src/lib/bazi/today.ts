import type { LifeProfile } from "../types";
import { adjustOverview } from "../adjust";
import { calculateBaziFromLifeProfileInput } from "./calculateBazi";
import { calculateDayImpact, toUserBazi } from "./dayImpact";

const { Solar } = require("lunar-javascript");

export type TodayHeaven = {
  date: string;
  ganzhiDay: string;
  dayStem: string;
  dayBranch: string;
  keywords: string[];
  generalImage: string;
  yi: string[];
  ji: string[];
  personalImpact: string;
  adjustment: string;
  quote: string;
  reasoning: string[];
};

const stemImages: Record<string, { keywords: string[]; image: string; yi: string[]; ji: string[]; quote: string }> = {
  甲: {
    keywords: ["生发", "规划", "立界", "启程"],
    image: "甲木如新枝出土，重在先定方向，再慢慢伸展。",
    yi: ["写计划", "定边界", "开启小步行动"],
    ji: ["急于求成", "反复改口", "硬碰规则"],
    quote: "木初生，宜立其根，不宜拔苗。",
  },
  乙: {
    keywords: ["柔顺", "连接", "修补", "协商"],
    image: "乙木如藤，贵在顺势连接，借力成形。",
    yi: ["沟通协商", "修复关系", "整理细节"],
    ji: ["含混承诺", "过度迁就", "拖延不决"],
    quote: "柔能入局，清则有根。",
  },
  丙: {
    keywords: ["明朗", "曝光", "表达", "行动"],
    image: "丙火如日，宜照见问题，也宜让作品见人。",
    yi: ["公开表达", "展示成果", "主动推进"],
    ji: ["情绪上头", "夸口过满", "忽略细节"],
    quote: "火明则事易，明而不躁为佳。",
  },
  丁: {
    keywords: ["专注", "温度", "打磨", "照明"],
    image: "丁火如灯，适合小处用心，把关键处照亮。",
    yi: ["打磨方案", "温和沟通", "补足材料"],
    ji: ["消耗心神", "暗自较劲", "临时变卦"],
    quote: "灯火不争烈，贵在照清眼前。",
  },
  戊: {
    keywords: ["稳定", "承载", "定盘", "责任"],
    image: "戊土如山，宜定住核心，少被杂音牵动。",
    yi: ["定规则", "做承诺清单", "稳定节奏"],
    ji: ["固执僵持", "承诺过满", "压住情绪"],
    quote: "土厚能载，先稳其位。",
  },
  己: {
    keywords: ["整理", "照料", "承接", "复盘"],
    image: "己土如田，宜整理、归类、承接现实细节。",
    yi: ["复盘账目", "整理空间", "照顾身体"],
    ji: ["琐碎内耗", "过度担心", "拖着不说"],
    quote: "田要常理，事要常清。",
  },
  庚: {
    keywords: ["决断", "规则", "清理", "标准"],
    image: "庚金如刀，宜立标准、断杂枝，但不宜伤人。",
    yi: ["清理任务", "明确边界", "制定标准"],
    ji: ["言语过硬", "仓促切断", "只看输赢"],
    quote: "金贵有度，断而不伤。",
  },
  辛: {
    keywords: ["精修", "审美", "校准", "收敛"],
    image: "辛金如玉，宜精修细节，修辞立信。",
    yi: ["校对文书", "优化呈现", "精简安排"],
    ji: ["挑剔过度", "自我消耗", "犹豫不定"],
    quote: "玉在琢磨，事在校准。",
  },
  壬: {
    keywords: ["流动", "信息", "变化", "远行"],
    image: "壬水如江，宜通信息、开视野，但要有岸。",
    yi: ["收集信息", "外联沟通", "灵活调整"],
    ji: ["随波逐流", "消息过载", "风险失控"],
    quote: "水行有岸，动而不乱。",
  },
  癸: {
    keywords: ["观察", "蓄养", "修复", "静心"],
    image: "癸水如雨，宜润物无声，先修复再推进。",
    yi: ["休整复盘", "补充信息", "柔性沟通"],
    ji: ["过度敏感", "暗自猜测", "迟迟不动"],
    quote: "雨润万物，贵在不急。",
  },
};

export function getTodayHeaven(profile?: LifeProfile | null, date = new Date()): TodayHeaven {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  const ganzhiDay = eightChar.getDay();
  const dayStem = ganzhiDay.slice(0, 1);
  const dayBranch = ganzhiDay.slice(1, 2);
  const base = stemImages[dayStem] ?? stemImages.甲;
  const reasoning = [`今日按系统日期 ${formatDate(date)} 取日柱为${ganzhiDay}。`];
  let personalImpact = "尚未立命时，先按通用天时参看：把眼前事拆小，先看现实证据，再决定行动。";
  let adjustment = "保持桌面与入口清爽，先整理一个能马上推进的小动作。";

  if (profile) {
    const bazi = profile.bazi ?? calculateBaziFromLifeProfileInput(profile);
    const impact = calculateDayImpact({
      todayStem: dayStem,
      todayBranch: dayBranch,
      userBazi: toUserBazi(bazi),
      usefulGods: adjustOverview.usefulElements,
    });
    personalImpact = impact.personalImpact;
    adjustment = impact.suggestedActions.join("；");
    reasoning.push(...impact.reasoning);
  }

  return {
    date: formatDate(date),
    ganzhiDay,
    dayStem,
    dayBranch,
    keywords: base.keywords,
    generalImage: `${ganzhiDay}日，${base.image}`,
    yi: base.yi,
    ji: base.ji,
    personalImpact,
    adjustment,
    quote: base.quote,
    reasoning,
  };
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
