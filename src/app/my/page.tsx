"use client";

import { useEffect, useState } from "react";
import { Button, Card, KeyValue, LinkButton, PageHeader, SectionTitle } from "@/components/ui";
import { adjustOverview, caseDisclaimer } from "@/lib/adjust";
import {
  resetAllZhijiData,
  useCaseRecords,
  useLifeProfile,
  useTodayViewed,
  useUserPreferences,
  type UserPreferences,
} from "@/lib/storage";
import { recordVisit, useUsageStats } from "@/lib/usage";

const preferenceOptions: {
  key: keyof UserPreferences;
  label: string;
  options: string[];
}[] = [
  { key: "resultMode", label: "问事结果偏好", options: ["简明", "详细"] },
  { key: "copyStyle", label: "文案风格", options: ["克制", "古风", "直白"] },
  { key: "homeEntry", label: "首页默认入口", options: ["今日", "问事"] },
];

export default function MyPage() {
  const { profile, clearProfile } = useLifeProfile();
  const { records, clearRecords } = useCaseRecords();
  const { viewed } = useTodayViewed();
  const { preferences, savePreferences } = useUserPreferences();
  const stats = useUsageStats();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const hasProfile = Boolean(profile);
  const hasCases = records.length > 0;

  useEffect(() => {
    recordVisit();
  }, []);

  const updatePreference = (key: keyof UserPreferences, value: string) => {
    savePreferences({ ...preferences, [key]: value } as UserPreferences);
  };

  const confirmAction = (message: string, action: () => void) => {
    if (window.confirm(message)) {
      action();
    }
  };

  return (
    <div>
      <PageHeader
        title="我的"
        eyebrow="当前板块 · 个人中心"
        description="你的命局、案卷、偏好和本地数据，都在这里统一管理。"
      />

      <section className="grid gap-6">
        <Card>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-song text-3xl font-semibold text-ink">本地档案</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <KeyValue label="命局状态" value={hasProfile ? "已立命" : "尚未立命"} />
                <KeyValue label="今日状态" value={viewed ? "已查看" : "未查看"} />
                <KeyValue label="当前喜用" value={adjustOverview.usefulElements.join("、")} />
                <KeyValue label="当前动象" value={adjustOverview.movement} />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/today" variant="secondary">看今日</LinkButton>
              <LinkButton href="/ask" variant="secondary">问一件事</LinkButton>
              <LinkButton href="/life">{hasProfile ? "查看命局" : "建立命局"}</LinkButton>
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle>数据总览</SectionTitle>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KeyValue label="累计问事" value={`${stats.totalAsks} 次`} />
            <KeyValue label="已存案卷" value={`${records.length} 份`} />
            <KeyValue label="今日访问" value={`${stats.todayVisits} 次`} />
            <KeyValue label="今日天时" value={`${stats.todayViews} 次`} />
            <KeyValue label="今日问事" value={`${stats.todayAsks} 次`} />
            <KeyValue label="调局查看" value={`${stats.adjustViews} 次`} />
            <KeyValue label="命局查看" value={`${stats.lifeViews} 次`} />
            <KeyValue label="最近使用" value={stats.lastVisitAt ? new Date(stats.lastVisitAt).toLocaleString("zh-CN") : "暂无"} />
          </div>
        </Card>

        <Card>
          <SectionTitle>我的偏好</SectionTitle>
          <div className="mt-5 grid gap-5">
            {preferenceOptions.map((group) => (
              <div className="grid gap-3 md:grid-cols-[9rem_1fr] md:items-center" key={group.key}>
                <p className="text-sm font-medium text-smoke">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const selected = preferences[group.key] === option;

                    return (
                      <button
                        className={`rounded-full border px-4 py-2 text-sm transition hover:-translate-y-0.5 ${
                          selected
                            ? "border-cinnabar/45 bg-cinnabar-soft/60 font-medium text-ink"
                            : "border-gold-soft bg-white/50 text-smoke hover:bg-white"
                        }`}
                        key={option}
                        onClick={() => updatePreference(group.key, option)}
                        type="button"
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>数据管理</SectionTitle>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button disabled={!hasProfile} onClick={() => confirmAction("确定清除本地命局？此操作只影响当前浏览器。", clearProfile)} variant="secondary">
              清除本地命局
            </Button>
            <Button disabled={!hasCases} onClick={() => confirmAction("确定清除所有案卷记录？此操作不可从本地恢复。", clearRecords)} variant="secondary">
              清除案卷记录
            </Button>
            <Button onClick={() => confirmAction("确定重置全部本地数据？命局、案卷、偏好和统计都会清除。", resetAllZhijiData)}>
              重置全部数据
            </Button>
          </div>
        </Card>

        <section className="rounded-2xl border border-gold-soft/60 bg-white/32 px-4 py-3">
          <p className="text-sm font-medium text-smoke">使用说明与责任声明</p>
          <p className="mt-2 max-w-2xl text-xs leading-6 text-smoke/80">
            知机用于自我观察、问事整理与生活参考，不替代专业意见。重大事项请结合现实情况与专业建议。
          </p>
          <button
            className="mt-2 text-xs font-medium text-ink underline decoration-gold-soft underline-offset-4 transition hover:text-cinnabar"
            onClick={() => setShowDisclaimer((current) => !current)}
            type="button"
          >
            {showDisclaimer ? "收起完整声明" : "查看完整声明"}
          </button>
          {showDisclaimer ? <p className="mt-3 text-xs leading-6 text-smoke/80">{caseDisclaimer}</p> : null}
        </section>
      </section>
    </div>
  );
}
