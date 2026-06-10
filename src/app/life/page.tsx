"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button, Card, Field, KeyValue, PageHeader, SectionTitle, SelectInput, TextInput } from "@/components/ui";
import { calculateBaziFromLifeProfileInput } from "@/lib/bazi/calculateBazi";
import { useLifeProfile } from "@/lib/storage";
import { buildLifeProfile } from "@/lib/templates";
import { recordLifeView, recordVisit } from "@/lib/usage";
import type { LifeProfileInput } from "@/lib/types";

const initialInput: LifeProfileInput = {
  calendarType: "阳历",
  birthYear: "",
  birthMonth: "",
  birthDay: "",
  birthHour: "",
  gender: "女",
  familyRole: "长女",
  birthplace: "",
};

const familyRoles = ["长男", "长女", "中男", "中女", "少男", "少女", "父亲", "母亲"];

export default function LifePage() {
  const { profile, saveProfile } = useLifeProfile();
  const [form, setForm] = useState<LifeProfileInput>({ ...initialInput, ...(profile ?? {}) });
  const [formOpen, setFormOpen] = useState(!profile);

  useEffect(() => {
    recordVisit();
    recordLifeView();
  }, []);

  const activeBazi = useMemo(() => {
    if (!profile) {
      return null;
    }

    return profile.bazi ?? calculateBaziFromLifeProfileInput(profile);
  }, [profile]);

  const update = (key: keyof LifeProfileInput, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    saveProfile(buildLifeProfile(form));
    setFormOpen(false);
  };

  const lifeSummary = activeBazi
    ? `此局日主为${activeBazi.dayMaster}，四柱为${activeBazi.yearPillar}、${activeBazi.monthPillar}、${activeBazi.dayPillar}、${activeBazi.hourPillar}。`
    : "尚未立命。录入出生信息后，将以真实四柱八字作为今日天时与问事占断的合参基础。";

  return (
    <div>
      <PageHeader
        title="一生命局"
        eyebrow="当前板块 · 命局档案"
        description="先立命，再问事。命局既定，今日天时与问事占断方可合参。"
      />

      <Card className="mb-6 border-cinnabar/20 bg-cinnabar-soft/35">
        <p className="text-sm font-medium text-smoke">命局总批</p>
        <p className="mt-4 font-song text-2xl font-semibold leading-10 text-ink">{lifeSummary}</p>
      </Card>

      <Card id="birth-form">
        <div className="mb-4 flex items-center justify-between gap-4">
          <SectionTitle>出生信息</SectionTitle>
          {profile ? (
            <Button
              onClick={() => {
                if (!formOpen) {
                  setForm({ ...initialInput, ...profile });
                }
                setFormOpen((current) => !current);
              }}
              type="button"
              variant="secondary"
            >
              {formOpen ? "收起" : "修改生辰八字"}
            </Button>
          ) : null}
        </div>

        {formOpen ? (
          <form className="grid gap-4 md:grid-cols-3" onSubmit={submit}>
            <Field label="历法">
              <SelectInput onChange={(event) => update("calendarType", event.target.value)} value={form.calendarType}>
                <option>阳历</option>
                <option>阴历</option>
              </SelectInput>
            </Field>
            <Field label="出生年">
              <TextInput inputMode="numeric" onChange={(event) => update("birthYear", event.target.value)} placeholder="1992" value={form.birthYear} />
            </Field>
            <Field label="出生月">
              <TextInput inputMode="numeric" onChange={(event) => update("birthMonth", event.target.value)} placeholder="8" value={form.birthMonth} />
            </Field>
            <Field label="出生日">
              <TextInput inputMode="numeric" onChange={(event) => update("birthDay", event.target.value)} placeholder="16" value={form.birthDay} />
            </Field>
            <Field label="出生时辰">
              <TextInput onChange={(event) => update("birthHour", event.target.value)} placeholder="辰时 / 8" value={form.birthHour} />
            </Field>
            <Field label="性别">
              <SelectInput onChange={(event) => update("gender", event.target.value)} value={form.gender}>
                <option>女</option>
                <option>男</option>
                <option>其他</option>
              </SelectInput>
            </Field>
            <Field label="身份">
              <SelectInput onChange={(event) => update("familyRole", event.target.value)} value={form.familyRole}>
                {familyRoles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="出生地">
              <TextInput onChange={(event) => update("birthplace", event.target.value)} placeholder="杭州" value={form.birthplace} />
            </Field>
            <div className="flex items-end md:col-span-1">
              <Button className="w-full" type="submit">排盘立命</Button>
            </div>
          </form>
        ) : (
          <div className="grid gap-3 md:grid-cols-4">
            <KeyValue label="历法" value={profile?.calendarType || "阳历"} />
            <KeyValue label="生辰" value={`${profile?.birthYear || "--"}年${profile?.birthMonth || "--"}月${profile?.birthDay || "--"}日 ${profile?.birthHour || "--"}`} />
            <KeyValue label="身份" value={profile?.familyRole || "未记录"} />
            <KeyValue label="出生地" value={profile?.birthplace || "未记录"} />
          </div>
        )}
      </Card>

      {profile ? (
        <section className="mt-8 grid gap-6">
          <Card>
            <SectionTitle>命局总览</SectionTitle>
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.keywords.map((keyword) => (
                <span className="rounded-full border border-gold-soft bg-white/60 px-3 py-1 text-sm text-smoke" key={keyword}>
                  {keyword}
                </span>
              ))}
            </div>
            <p className="mt-5 font-song text-2xl leading-10 text-ink">{lifeSummary}</p>
          </Card>

          <Card>
            <SectionTitle>四柱八字</SectionTitle>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <KeyValue label="年柱" value={activeBazi?.yearPillar ?? profile.pillars.year} />
              <KeyValue label="月柱" value={activeBazi?.monthPillar ?? profile.pillars.month} />
              <KeyValue label="日柱" value={activeBazi?.dayPillar ?? profile.pillars.day} />
              <KeyValue label="时柱" value={activeBazi?.hourPillar ?? profile.pillars.hour} />
            </div>
            {activeBazi ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-4">
                <KeyValue label="日主" value={activeBazi.dayMaster} />
                <KeyValue label="四柱天干" value={activeBazi.heavenlyStems.join("、")} />
                <KeyValue label="四柱地支" value={activeBazi.earthlyBranches.join("、")} />
                <KeyValue label="排盘历法" value={activeBazi.calendarType === "lunar" ? "阴历" : "阳历"} />
              </div>
            ) : null}
          </Card>

          <ReadingGrid title="子平结构" items={profile.ziping} />
          <ReadingGrid title="盲派象法" items={profile.blindSymbols} />
          <ReadingGrid title="紫微辅象" items={profile.ziwei} />

          <Card>
            <SectionTitle>大运阶段</SectionTitle>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {profile.luckTimeline.map((item) => (
                <KeyValue key={item.range} label={item.range} value={item.theme} />
              ))}
            </div>
            <p className="mt-5 rounded-2xl bg-gold/10 p-4 leading-8 text-ink">{profile.currentStage}</p>
          </Card>

          <Card>
            <SectionTitle>一生总批</SectionTitle>
            <p className="mt-5 font-song text-2xl leading-10 text-ink">{profile.finalReading}</p>
          </Card>
        </section>
      ) : null}
    </div>
  );
}

function ReadingGrid({ title, items }: { title: string; items: Record<string, string> }) {
  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {Object.entries(items).map(([label, value]) => (
          <KeyValue key={label} label={label} value={value} />
        ))}
      </div>
    </Card>
  );
}
