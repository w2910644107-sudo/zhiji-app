import { Card, KeyValue, PageHeader, SectionTitle } from "@/components/ui";
import { calculateBazi } from "@/lib/bazi/calculateBazi";

export default function DebugBaziPage() {
  const result = calculateBazi({
    calendarType: "solar",
    year: 2000,
    month: 2,
    day: 2,
    hour: 2,
    gender: "女",
    birthPlace: "杭州",
  });

  return (
    <div>
      <PageHeader
        title="Debug · 八字排盘"
        eyebrow="开发检查"
        description="用于确认 lunar-javascript 四柱排盘是否正常工作。"
      />
      <Card>
        <SectionTitle>示例：阳历 2000年2月2日 2时</SectionTitle>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <KeyValue label="年柱" value={result.yearPillar} />
          <KeyValue label="月柱" value={result.monthPillar} />
          <KeyValue label="日柱" value={result.dayPillar} />
          <KeyValue label="时柱" value={result.hourPillar} />
          <KeyValue label="日主" value={result.dayMaster} />
          <KeyValue label="四柱天干" value={result.heavenlyStems.join("、")} />
          <KeyValue label="四柱地支" value={result.earthlyBranches.join("、")} />
          <KeyValue label="历法" value={result.calendarType === "lunar" ? "阴历" : "阳历"} />
        </div>
      </Card>
    </div>
  );
}
