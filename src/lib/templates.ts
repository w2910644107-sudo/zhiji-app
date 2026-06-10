import type { CaseRecord, LifeProfile, LifeProfileInput } from "./types";
import { getCaseKeyAdvice, getCaseRisk } from "./adjust";
import { calculateBaziFromLifeProfileInput } from "./bazi/calculateBazi";
import { getTodayHeaven } from "./bazi/today";

const liurenTexts: Record<string, string> = {
  大安: "事有定处，宜守正推进，先把已答应的环节做稳。",
  留连: "事势拖延，关键不在能力，而在对方反馈和流程卡点。",
  速喜: "有快信可得，适合主动发问、确认窗口，但不宜夸口。",
  赤口: "口舌易起，谈条件要留文字，不要在情绪里定结论。",
  小吉: "小处有利，先做低成本验证，能见到一段正向回声。",
  空亡: "信息不足，眼前像空，宜等一个关键证据再下注。",
};

export function buildLifeProfile(input: LifeProfileInput): LifeProfile {
  const bazi = calculateBaziFromLifeProfileInput(input);

  return {
    ...input,
    createdAt: new Date().toISOString(),
    bazi,
    keywords: ["清醒", "守界", "渐进成势"],
    summary: `此局日主为${bazi.dayMaster}，四柱为${bazi.yearPillar}、${bazi.monthPillar}、${bazi.dayPillar}、${bazi.hourPillar}。先以真实八字定盘，再看天时与问事之机。`,
    pillars: {
      year: bazi.yearPillar,
      month: bazi.monthPillar,
      day: bazi.dayPillar,
      hour: bazi.hourPillar,
    },
    ziping: {
      日主旺衰: "日主气势需结合月令、地支与透干同看，眼前宜先看可执行的节奏。",
      月令气势: "月柱主当令环境，适合用来判断外部压力、规则与资源入口。",
      十神分布: "十神关系会随日主而定，问事时重点看此事落在财、官、印、食伤或比劫哪一类。",
      格局倾向: "先取清贵成事之象，忌杂乱多头、临时改口。",
      喜用取象: "喜用仍需持续细排，当前先以调局建议作为生活取象参考。",
    },
    blindSymbols: {
      事业象: "事业要靠作品和口碑累积，越能标准化，越容易被看见。",
      财象: "财来不宜急，适合稳定现金流、副线试水、长期复利。",
      感情象: "感情重承诺与边界，怕互相猜测，也怕只讲道理不讲温度。",
      贵人象: "贵人多在专业场、制度内、年长或有资源整合能力的人。",
      阻碍象: "阻碍来自犹豫反复与信息不齐，凡事怕只凭感觉开局。",
    },
    ziwei: {
      命宫: "命宫见稳，主自我要求高，遇事先观察后出手。",
      官禄宫: "官禄宫有进阶象，适合拿证、升级、进入更清晰的平台。",
      财帛宫: "财帛宫宜正财先行，偏财可试不可贪。",
      迁移宫: "迁移动中有机，外部机会多，但要先定目标。",
      夫妻宫: "夫妻宫重信任建设，关系中需要把期待说清。",
    },
    luckTimeline: [
      { range: "18-27", theme: "试锋：学习规则，累积第一批可信作品。" },
      { range: "28-37", theme: "立身：角色加重，事业与关系都要定边界。" },
      { range: "38-47", theme: "成局：可借平台与团队放大能力。" },
      { range: "48-57", theme: "收放：重资产与长期关系要稳中调整。" },
    ],
    currentStage: "当前阶段宜先稳住主线，再试一条可撤回的小路。",
    finalReading: "此命局不是一夜暴起之局，而是越清醒、越有章法，越能成势。重大选择宜先问代价，再问机会。",
  };
}

export function buildCaseRecord(question: string, type: string, profileInput: boolean | LifeProfile | null): CaseRecord {
  const profile = typeof profileInput === "boolean" ? null : profileInput;
  const hasProfile = Boolean(profile);
  const today = getTodayHeaven(profile);
  const hash = Array.from(question).reduce((sum, char) => sum + char.charCodeAt(0), type.length);
  const names = Object.keys(liurenTexts);
  const liurenName = names[hash % names.length];
  const isRelationship = type === "感情";
  const isMoney = type === "财运" || type === "副业";
  const isCareer = type === "事业" || type === "项目" || type === "合作";

  const verdict = isRelationship
    ? "此事可再观察一轮，但不能继续含混消耗。"
    : isMoney
      ? "此事可小试，不可重仓。"
      : isCareer
        ? "此事可成，但不可空动。"
        : "此事可推进一步，但先做低成本验证。";

  return {
    id: `${Date.now()}-${hash}`,
    question,
    type,
    createdAt: new Date().toISOString(),
    todayGanzhi: today.ganzhiDay,
    verdict,
    keyAdvice: getCaseKeyAdvice(type),
    riskTip: getCaseRisk(type),
    lifeView: hasProfile
      ? profile?.bazi
        ? `已合参你的命局：日主${profile.bazi.dayMaster}，四柱为${profile.bazi.yearPillar}、${profile.bazi.monthPillar}、${profile.bazi.dayPillar}、${profile.bazi.hourPillar}。`
        : "命局已立，凡事先明责权，再谈速度。"
      : "尚未立命，本次以通用天时与问事象法为主；立命后可参看更细的个人节奏。",
    todayView: `${today.ganzhiDay}见${today.keywords.join("、")}之象。${today.personalImpact}`,
    symbolReading: isRelationship
      ? "此象不怕慢，怕含混。把是否继续、如何继续、何时复盘说清，关系才有转机。"
      : isMoney
        ? "财象有门槛，先看回款、成本、责任人三件事，少听热闹，多看凭据。"
        : "象法见“先束后伸”，眼下最要紧的是整理资源与条件，不是立刻冲锋。",
    liuren: {
      name: liurenName,
      text: liurenTexts[liurenName],
    },
    yijing: {
      current: "当前阶段：定界。",
      turnable: "可转阶段：小试有回声后，再转入推进。",
      risk: "误入阶段：凭一时兴起扩大承诺，后续容易被细节拖住。",
    },
    advice: [
      "把问题拆成一个可验证的小动作，并设定三到七天反馈点。",
      "所有关键条件留文字，不在情绪高点做最终承诺。",
      "若对方迟迟不给明确回应，以一次清楚追问代替反复猜测。",
    ],
    note: "今日之机在修形，不在争快。先整其序，再动其事，方不被局势牵着走。",
  };
}

export const questionTypes = ["事业", "财运", "感情", "合作", "学业", "搬迁", "项目", "副业", "其他"];
