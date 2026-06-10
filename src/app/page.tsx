"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Field, LinkButton, SelectInput, TextArea, TextInput } from "@/components/ui";
import { getTodayHeaven } from "@/lib/bazi/today";
import { useCaseRecords, useLifeProfile } from "@/lib/storage";
import { buildLifeProfile } from "@/lib/templates";
import { recordVisit } from "@/lib/usage";
import type { LifeProfileInput } from "@/lib/types";

const familyRoles = ["长男", "长女", "中男", "中女", "少男", "少女", "父亲", "母亲"];
const quickQuestions = ["我要不要跳槽？", "这段关系如何？", "这个项目能不能做？"];

const initialBirthForm: LifeProfileInput = {
  calendarType: "阳历",
  birthYear: "",
  birthMonth: "",
  birthDay: "",
  birthHour: "",
  gender: "女",
  familyRole: "长女",
  birthplace: "",
};

function formatBirthSummary(input: LifeProfileInput) {
  const hour = input.birthHour ? `${input.birthHour}${/^\d+$/.test(input.birthHour) ? "时" : ""}` : "--";
  return `${input.calendarType} ${input.birthYear || "--"}年${input.birthMonth || "--"}月${input.birthDay || "--"}日 ${hour} · ${input.gender} · ${input.familyRole}`;
}

export default function HomePage() {
  const router = useRouter();
  const { profile, saveProfile } = useLifeProfile();
  const { records } = useCaseRecords();
  const [question, setQuestion] = useState("");
  const [birthForm, setBirthForm] = useState<LifeProfileInput>({ ...initialBirthForm, ...(profile ?? {}) });
  const [birthPanelOpen, setBirthPanelOpen] = useState(false);
  const [birthSaved, setBirthSaved] = useState(false);
  const today = useMemo(() => getTodayHeaven(profile), [profile]);
  const recentRecords = useMemo(() => records.slice(0, 3), [records]);

  useEffect(() => {
    recordVisit();
  }, []);

  const updateBirthForm = (key: keyof LifeProfileInput, value: string) => {
    setBirthForm((current) => ({ ...current, [key]: value }));
    setBirthSaved(false);
  };

  const openBirthPanel = () => {
    setBirthForm({ ...initialBirthForm, ...(profile ?? {}) });
    setBirthPanelOpen(true);
    setBirthSaved(false);
  };

  const cancelBirthEdit = () => {
    setBirthForm({ ...initialBirthForm, ...(profile ?? {}) });
    setBirthPanelOpen(false);
    setBirthSaved(false);
  };

  const submitBirthForm = (event: FormEvent) => {
    event.preventDefault();
    saveProfile(buildLifeProfile(birthForm));
    setBirthPanelOpen(false);
    setBirthSaved(true);
    window.setTimeout(() => setBirthSaved(false), 2000);
  };

  const startAsk = () => {
    const query = question.trim();
    router.push(query ? `/ask?q=${encodeURIComponent(query)}` : "/ask");
  };

  return (
    <div className="paper-texture rounded-[32px] pb-4">
      <section className="pt-3 sm:pt-6">
        <p className="text-sm text-smoke/75">当前板块 · 今日与问事</p>
        <h1 className="mt-4 max-w-4xl font-song text-[2.1rem] font-semibold leading-[1.16] text-ink sm:text-5xl lg:text-[3.15rem]">
          今日有今日之气，眼前事有眼前之机。
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-smoke sm:text-lg">
          以八字为根，合参天时、象法与问事条件，为你判断一件事的节奏、风险和下一步。
        </p>
      </section>

      <section className="mt-5">
        <div className="rounded-[22px] border border-gold-soft/70 bg-white/52 px-4 py-3 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink">
              {profile ? "已立命 · 今日天时已合参你的命局" : "尚未立命 · 立命后问事会更贴合你"}
            </p>
            <p className="mt-1 text-xs leading-6 text-smoke sm:truncate">
              {profile ? `当前生辰：${formatBirthSummary(profile)}` : "当前生辰：尚未填写"}
            </p>
            {profile?.bazi ? (
              <p className="text-xs leading-6 text-smoke/80 sm:truncate">
                八字：{profile.bazi.yearPillar} {profile.bazi.monthPillar} {profile.bazi.dayPillar} {profile.bazi.hourPillar} · 日主{profile.bazi.dayMaster}
              </p>
            ) : null}
          </div>
          <Button className="mt-3 w-full shrink-0 sm:mt-0 sm:w-auto" onClick={openBirthPanel} type="button" variant="secondary">
            {profile ? "修改" : "建立命局"}
          </Button>
        </div>

        {birthSaved ? (
          <p className="mt-3 rounded-full border border-cinnabar/20 bg-cinnabar-soft/45 px-4 py-2 text-sm font-medium text-cinnabar">
            已保存，今日天时与问事占断将合参此命局。
          </p>
        ) : null}

        {birthPanelOpen ? (
          <div className="mt-4 rounded-[28px] border border-cinnabar/20 bg-cinnabar-soft/35 p-5 shadow-card sm:p-6">
            <h2 className="font-song text-2xl font-semibold text-ink">生辰记录</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-smoke">
              输入生日、时辰、性别与身份后，今日天时与问事占断会合参此命局。
            </p>
            <form className="mt-5 grid gap-3" onSubmit={submitBirthForm}>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="历法">
                  <SelectInput onChange={(event) => updateBirthForm("calendarType", event.target.value)} value={birthForm.calendarType}>
                    <option>阳历</option>
                    <option>阴历</option>
                  </SelectInput>
                </Field>
                <Field label="性别">
                  <SelectInput onChange={(event) => updateBirthForm("gender", event.target.value)} value={birthForm.gender}>
                    <option>女</option>
                    <option>男</option>
                    <option>其他</option>
                  </SelectInput>
                </Field>
                <Field label="身份">
                  <SelectInput onChange={(event) => updateBirthForm("familyRole", event.target.value)} value={birthForm.familyRole}>
                    {familyRoles.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </SelectInput>
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <TextInput aria-label="出生年" inputMode="numeric" onChange={(event) => updateBirthForm("birthYear", event.target.value)} placeholder="年" value={birthForm.birthYear} />
                <TextInput aria-label="出生月" inputMode="numeric" onChange={(event) => updateBirthForm("birthMonth", event.target.value)} placeholder="月" value={birthForm.birthMonth} />
                <TextInput aria-label="出生日" inputMode="numeric" onChange={(event) => updateBirthForm("birthDay", event.target.value)} placeholder="日" value={birthForm.birthDay} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput aria-label="出生时辰" onChange={(event) => updateBirthForm("birthHour", event.target.value)} placeholder="时辰或小时，例如 2" value={birthForm.birthHour} />
                <TextInput aria-label="出生地" onChange={(event) => updateBirthForm("birthplace", event.target.value)} placeholder="出生地" value={birthForm.birthplace} />
              </div>
              <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
                <Button className="sm:min-w-36" type="submit">保存生辰修改</Button>
                <Button className="sm:min-w-24" onClick={cancelBirthEdit} type="button" variant="secondary">取消</Button>
              </div>
            </form>
          </div>
        ) : null}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        <Card className="min-h-[390px] p-7 sm:p-8">
          <p className="text-sm font-medium text-smoke">今日天时</p>
          <p className="mt-8 font-song text-6xl font-semibold text-ink sm:text-7xl">{today.ganzhiDay}日</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {today.keywords.map((keyword) => (
              <span className="rounded-full border border-gold-soft bg-white/62 px-3 py-1 text-sm text-smoke" key={keyword}>
                {keyword}
              </span>
            ))}
          </div>
          <div className="mt-8 grid gap-3 text-sm leading-7 text-smoke">
            <p><span className="font-medium text-ink">宜：</span>{today.yi.join("、")}</p>
            <p><span className="font-medium text-ink">忌：</span>{today.ji.join("、")}</p>
          </div>
          <p className="mt-8 max-w-md font-song text-2xl font-semibold leading-10 text-ink sm:text-3xl">“{today.quote}”</p>
          <LinkButton className="mt-8" href="/today" variant="secondary">看今日对我</LinkButton>
        </Card>

        <Card className="min-h-[390px] p-7 shadow-soft sm:p-8">
          <p className="text-sm font-medium text-smoke">问事占断</p>
          <h2 className="mt-4 font-song text-3xl font-semibold text-ink sm:text-4xl">问一件正在犹豫的事</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-smoke sm:text-base">
            写下你眼前最拿不准的事，系统会合参命局、天时、象法与辅断，给出总断、风险和行动建议。
          </p>
          <TextArea
            className="mt-6 min-h-44 text-base"
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="例如：我要不要跳槽？这段关系还要继续吗？这个项目能不能做？"
            value={question}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {quickQuestions.map((item) => (
              <button
                className="rounded-full border border-gold-soft bg-white/58 px-3 py-2 text-sm text-smoke transition hover:bg-white hover:text-ink"
                key={item}
                onClick={() => setQuestion(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <Button className="mt-6 min-h-12 w-full px-7 text-base" onClick={startAsk}>呈上此事</Button>
        </Card>
      </section>

      <section className="mt-9">
        {recentRecords.length ? (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-song text-2xl font-semibold text-ink">最近案卷</h2>
              <LinkButton href="/cases" variant="secondary">查看全部</LinkButton>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {recentRecords.map((record) => (
                <Card className="p-5" key={record.id}>
                  <p className="text-xs text-smoke">{record.type}</p>
                  <p className="mt-3 line-clamp-2 font-medium leading-7 text-ink">{record.question}</p>
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-smoke">{record.verdict}</p>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-full border border-gold-soft/60 bg-white/38 px-5 py-3 text-sm text-smoke shadow-sm">
            暂无案卷。你可以先问一件正在犹豫的事。
          </div>
        )}
      </section>
    </div>
  );
}
