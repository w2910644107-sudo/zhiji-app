"use client";

import { useEffect, useMemo } from "react";
import { Card, KeyValue, LinkButton, PageHeader, SectionTitle } from "@/components/ui";
import { getTodayHeaven } from "@/lib/bazi/today";
import { useLifeProfile, useTodayViewed } from "@/lib/storage";
import { caseDisclaimer } from "@/lib/adjust";
import { recordTodayView, recordVisit } from "@/lib/usage";

export default function TodayPage() {
  const { profile } = useLifeProfile();
  const { markViewed } = useTodayViewed();
  const today = useMemo(() => getTodayHeaven(profile), [profile]);

  useEffect(() => {
    markViewed();
    recordVisit();
    recordTodayView();
  }, [markViewed]);

  return (
    <div>
      <PageHeader
        title="今日天时"
        eyebrow="当前板块 · 今日天时"
        description="看今日之气如何落到眼前事：宜何者、忌何者，先定节奏，再动其事。"
      />

      <section className="grid gap-6">
        <Card>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-smoke">今日干支</p>
              <p className="mt-2 font-song text-5xl font-semibold text-ink sm:text-6xl">{today.ganzhiDay}日</p>
            </div>
            <p className="rounded-full border border-gold-soft bg-white/60 px-4 py-2 text-sm text-smoke">
              {profile ? "已结合你的一生命局参看。" : "当前为通用天时，立命后可查看与你命局的关系。"}
            </p>
          </div>
        </Card>

        <Card>
          <SectionTitle>今日之象</SectionTitle>
          <p className="mt-4 leading-8 text-smoke">{today.generalImage}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {today.keywords.map((item) => (
              <span className="rounded-full border border-gold-soft bg-white/60 px-4 py-2 text-sm text-ink" key={item}>
                {item}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>对我的影响</SectionTitle>
          <p className="mt-4 leading-8 text-smoke">{today.personalImpact}</p>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <SectionTitle>今日宜</SectionTitle>
            <div className="mt-5 flex flex-wrap gap-2">
              {today.yi.map((item) => (
                <span className="rounded-full border border-gold-soft bg-white/60 px-4 py-2 text-sm text-ink" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </Card>
          <Card>
            <SectionTitle>今日忌</SectionTitle>
            <div className="mt-5 flex flex-wrap gap-2">
              {today.ji.map((item) => (
                <span className="rounded-full border border-gold-soft bg-white/60 px-4 py-2 text-sm text-smoke" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <SectionTitle>今日调局建议</SectionTitle>
          <p className="mt-4 leading-8 text-smoke">{today.adjustment}</p>
        </Card>

        <Card>
          <SectionTitle>合参依据</SectionTitle>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <KeyValue label="天干" value={today.dayStem} />
            <KeyValue label="地支" value={today.dayBranch} />
            <KeyValue label="取象" value={today.reasoning} />
          </div>
        </Card>

        <Card className="border-cinnabar/20 bg-cinnabar-soft/35">
          <p className="text-sm font-medium text-smoke">今日批文</p>
          <p className="mt-5 font-song text-3xl font-semibold leading-[1.7] text-ink sm:text-4xl">
            {today.quote}
          </p>
          {!profile ? <LinkButton className="mt-6" href="/life">建立我的命局</LinkButton> : null}
        </Card>

        <Card className="bg-white/48">
          <SectionTitle>责任声明</SectionTitle>
          <p className="mt-4 text-sm leading-7 text-smoke">{caseDisclaimer}</p>
        </Card>
      </section>
    </div>
  );
}
