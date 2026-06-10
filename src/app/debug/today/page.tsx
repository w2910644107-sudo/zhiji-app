import { Card, KeyValue, PageHeader, SectionTitle } from "@/components/ui";
import { getTodayHeaven } from "@/lib/bazi/today";

export default function DebugTodayPage() {
  const today = getTodayHeaven(null);

  return (
    <div>
      <PageHeader
        title="Debug · 今日天时"
        eyebrow="开发检查"
        description="用于确认当前日期的真实日柱与今日取象。"
      />
      <Card>
        <SectionTitle>{today.date}</SectionTitle>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <KeyValue label="今日干支" value={`${today.ganzhiDay}日`} />
          <KeyValue label="天干" value={today.dayStem} />
          <KeyValue label="地支" value={today.dayBranch} />
          <KeyValue label="关键词" value={today.keywords.join("、")} />
          <KeyValue label="宜" value={today.yi.join("、")} />
          <KeyValue label="忌" value={today.ji.join("、")} />
        </div>
        <p className="mt-5 leading-8 text-smoke">{today.generalImage}</p>
      </Card>
    </div>
  );
}
