"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Card, Field, KeyValue, PageHeader, SectionTitle, TextArea } from "@/components/ui";
import { caseAdjustAdvice, caseDisclaimer, getCaseKeyAdvice, getCaseRisk } from "@/lib/adjust";
import { useCaseRecords, useLifeProfile } from "@/lib/storage";
import { buildCaseRecord, questionTypes } from "@/lib/templates";
import { recordAsk, recordCaseCreated, recordVisit } from "@/lib/usage";
import type { CaseRecord } from "@/lib/types";

const steps = [
  "正在参看命局……",
  "正在观今日天时……",
  "正在取象断事……",
  "正在辅以小六壬……",
  "正在推演易经阶段……",
  "正在拟定批文……",
];

export default function AskPage() {
  return (
    <Suspense>
      <AskContent />
    </Suspense>
  );
}

function AskContent() {
  const params = useSearchParams();
  const [question, setQuestion] = useState(params.get("q") || "");
  const [type, setType] = useState("事业");
  const [activeStep, setActiveStep] = useState(-1);
  const [result, setResult] = useState<CaseRecord | null>(null);
  const { profile } = useLifeProfile();
  const { saveRecord } = useCaseRecords();

  useEffect(() => {
    recordVisit();
  }, []);

  useEffect(() => {
    if (activeStep < 0 || activeStep >= steps.length) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (activeStep === steps.length - 1) {
        const record = buildCaseRecord(question, type, profile);
        setResult(record);
        saveRecord(record);
        recordCaseCreated();
        setActiveStep(steps.length);
        return;
      }

      setActiveStep((current) => current + 1);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [activeStep, profile, question, saveRecord, type]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!question.trim()) {
      return;
    }

    setResult(null);
    recordAsk();
    setActiveStep(0);
  };

  return (
    <div>
      <PageHeader
        title="问事占断"
        eyebrow="当前板块 · 呈事问断"
        description="只问眼前一事。问题越具体，批文越能落到现实动作。"
      />

      <Card>
        <form className="grid gap-5" onSubmit={submit}>
          <Field label="所问之事">
            <TextArea
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="例如：我要不要跳槽？这段关系还要继续吗？这个项目能不能做？"
              value={question}
            />
          </Field>
          <div>
            <p className="text-sm font-medium text-smoke">事情类型</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {questionTypes.map((item) => {
                const selected = item === type;

                return (
                  <button
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition hover:-translate-y-0.5 hover:bg-white ${
                      selected
                        ? "border-cinnabar/45 bg-cinnabar-soft/60 font-medium text-ink"
                        : "border-gold-soft bg-white/50 text-smoke"
                    }`}
                    key={item}
                    onClick={() => setType(item)}
                    type="button"
                  >
                    {item}
                    {selected ? (
                      <span className="inline-flex items-center gap-1 text-xs text-cinnabar">
                        <span className="h-1.5 w-1.5 rounded-full bg-cinnabar" />
                        已选
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
          <Button className="w-fit" disabled={!question.trim() || (activeStep >= 0 && activeStep < steps.length)} type="submit">
            呈上此事
          </Button>
          <p className="text-xs leading-6 text-smoke/75">
            问事结果用于辅助整理思路，不构成投资、医疗、法律、职业或情感决策的最终建议。
          </p>
        </form>
      </Card>

      {activeStep >= 0 && activeStep < steps.length ? (
        <Card className="mt-6">
          <SectionTitle>合参推演</SectionTitle>
          <div className="mt-5 grid gap-3">
            {steps.map((step, index) => (
              <div className="flex items-center gap-3 text-sm text-smoke" key={step}>
                <span className={`h-2.5 w-2.5 rounded-full ${index <= activeStep ? "bg-cinnabar" : "bg-gold-soft"}`} />
                <span className={index <= activeStep ? "text-ink" : ""}>{step}</span>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {result ? (
        <section className="mt-6 grid gap-5">
          <Card className="border-cinnabar/20 bg-cinnabar-soft/35">
            <p className="text-sm font-medium text-smoke">案卷：{result.question}</p>
            <p className="mt-5 text-sm font-medium text-smoke">总断</p>
            <p className="mt-2 font-song text-3xl font-semibold leading-[1.65] text-ink">
              {result.verdict}
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <KeyValue label="关键建议" value={result.keyAdvice ?? getCaseKeyAdvice(result.type)} />
              <KeyValue label="风险提示" value={result.riskTip ?? getCaseRisk(result.type)} />
            </div>
          </Card>
          <div className="grid gap-5 md:grid-cols-2">
            <KeyCard label="命局所见" value={result.lifeView} />
            <KeyCard label="今日天时" value={result.todayView} />
            <KeyCard label="象法断语" value={result.symbolReading} />
            <KeyCard label={`小六壬：${result.liuren.name}`} value={result.liuren.text} />
          </div>
          <Card>
            <SectionTitle>易经阶段</SectionTitle>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <KeyValue label="当前阶段" value={result.yijing.current} />
              <KeyValue label="可转阶段" value={result.yijing.turnable} />
              <KeyValue label="误入阶段" value={result.yijing.risk} />
            </div>
          </Card>
          <Card>
            <SectionTitle>行动建议</SectionTitle>
            <ol className="mt-5 grid gap-3">
              {result.advice.map((item, index) => (
                <li className="rounded-2xl border border-gold-soft/70 bg-white/52 p-4 leading-7 text-smoke" key={item}>
                  {index + 1}. {item}
                </li>
              ))}
            </ol>
          </Card>
          <Card>
            <SectionTitle>批文</SectionTitle>
            <p className="mt-5 font-song text-3xl font-semibold leading-[1.7] text-ink">{result.note}</p>
          </Card>
          <Card>
            <SectionTitle>此事调局建议</SectionTitle>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <KeyValue label="方位建议" value={caseAdjustAdvice.direction} />
              <KeyValue label="色系建议" value={caseAdjustAdvice.color} />
              <KeyValue label="阳宅建议" value={caseAdjustAdvice.home} />
              <KeyValue label="心法建议" value={caseAdjustAdvice.mindset} />
            </div>
          </Card>
          <Card className="bg-white/48">
            <SectionTitle>责任声明</SectionTitle>
            <p className="mt-4 text-sm leading-7 text-smoke">{caseDisclaimer}</p>
          </Card>
        </section>
      ) : null}
    </div>
  );
}

function KeyCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <SectionTitle>{label}</SectionTitle>
      <p className="mt-4 leading-8 text-smoke">{value}</p>
    </Card>
  );
}
