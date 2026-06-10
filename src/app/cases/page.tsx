"use client";

import { useEffect, useState } from "react";
import { Button, Card, KeyValue, LinkButton, PageHeader, SectionTitle } from "@/components/ui";
import { caseAdjustAdvice, caseDisclaimer, getCaseKeyAdvice, getCaseRisk } from "@/lib/adjust";
import { useCaseRecords } from "@/lib/storage";
import { recordVisit } from "@/lib/usage";
import type { CaseRecord } from "@/lib/types";

export default function CasesPage() {
  const { records, deleteRecord } = useCaseRecords();
  const [selected, setSelected] = useState<CaseRecord | null>(null);
  const active = selected && records.some((record) => record.id === selected.id) ? selected : records[0] || null;

  useEffect(() => {
    recordVisit();
  }, []);

  const removeRecord = (record: CaseRecord) => {
    if (window.confirm("确定删除这份案卷吗？此操作只影响当前浏览器。")) {
      deleteRecord(record.id);
      if (selected?.id === record.id) {
        setSelected(null);
      }
    }
  };

  return (
    <div>
      <PageHeader
        title="案卷记录"
        eyebrow="当前板块 · 历史案卷"
        description="每一次问事都会存为案卷，方便回看当时的判断、条件和行动建议。"
      />

      {records.length ? (
        <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="grid content-start gap-4">
            {records.map((record) => {
              const activeRecord = active?.id === record.id;

              return (
                <button
                  className={`rounded-[24px] border p-5 text-left shadow-card transition hover:-translate-y-0.5 ${
                    activeRecord
                      ? "border-cinnabar/40 bg-cinnabar-soft/50"
                      : "border-gold-soft/80 bg-white/70 hover:bg-white"
                  }`}
                  key={record.id}
                  onClick={() => setSelected(record)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-smoke">{record.type}</span>
                    <span className="text-xs text-smoke">{new Date(record.createdAt).toLocaleString("zh-CN")}</span>
                  </div>
                  <p className="mt-3 font-medium leading-7 text-ink">{record.question}</p>
                  <p className="mt-3 text-sm leading-6 text-smoke">{record.verdict}</p>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-smoke">批文摘要：{record.note}</p>
                </button>
              );
            })}
          </div>

          {active ? <CaseDetail onDelete={() => removeRecord(active)} record={active} /> : null}
        </section>
      ) : (
        <Card>
          <p className="text-smoke">暂无案卷，先去问一件事。</p>
          <LinkButton className="mt-5" href="/ask">去问一件事</LinkButton>
        </Card>
      )}
    </div>
  );
}

function CaseDetail({ onDelete, record }: { onDelete: () => void; record: CaseRecord }) {
  const copyNote = async () => {
    await navigator.clipboard?.writeText(record.note);
  };

  return (
    <div className="grid gap-5">
      <Card className="border-cinnabar/20 bg-cinnabar-soft/35">
        <p className="text-sm font-medium text-smoke">案卷：{record.question}</p>
        <p className="mt-5 text-sm font-medium text-smoke">总断</p>
        <p className="mt-2 font-song text-3xl font-semibold leading-[1.65] text-ink">{record.verdict}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <KeyValue label="今日干支" value={record.todayGanzhi || "已记录"} />
          <KeyValue label="关键建议" value={record.keyAdvice ?? getCaseKeyAdvice(record.type)} />
          <KeyValue label="风险提示" value={record.riskTip ?? getCaseRisk(record.type)} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <LinkButton href={`/ask?q=${encodeURIComponent(record.question)}`} variant="secondary">继续追问</LinkButton>
          <Button onClick={copyNote} type="button" variant="secondary">复制批文</Button>
          <Button onClick={onDelete} type="button" variant="secondary">删除案卷</Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <KeyCard label="命局所见" value={record.lifeView} />
        <KeyCard label="今日天时" value={record.todayView} />
        <KeyCard label="象法断语" value={record.symbolReading} />
        <KeyCard label={`小六壬：${record.liuren.name}`} value={record.liuren.text} />
      </div>

      <Card>
        <SectionTitle>易经阶段</SectionTitle>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <KeyValue label="当前阶段" value={record.yijing.current} />
          <KeyValue label="可转阶段" value={record.yijing.turnable} />
          <KeyValue label="误入阶段" value={record.yijing.risk} />
        </div>
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

      <Card>
        <SectionTitle>行动建议</SectionTitle>
        <ol className="mt-5 grid gap-3">
          {record.advice.map((item, index) => (
            <li className="rounded-2xl border border-gold-soft/70 bg-white/52 p-4 leading-7 text-smoke" key={item}>
              {index + 1}. {item}
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <SectionTitle>批文</SectionTitle>
        <p className="mt-5 font-song text-3xl font-semibold leading-[1.7] text-ink">{record.note}</p>
      </Card>

      <Card className="bg-white/48">
        <SectionTitle>责任声明</SectionTitle>
        <p className="mt-4 text-sm leading-7 text-smoke">{caseDisclaimer}</p>
      </Card>
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
