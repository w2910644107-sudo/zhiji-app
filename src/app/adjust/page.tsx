"use client";

import { useEffect, useState } from "react";
import { Card, KeyValue, PageHeader, SectionTitle } from "@/components/ui";
import {
  adjustOverview,
  elementAdjustments,
  mindsetSummary,
  mindsetYaoAdvice,
  movementAdvice,
  palaceDescriptions,
  palaceGrid,
  rankingAdvice,
  type PalaceKey,
} from "@/lib/adjust";
import { recordAdjustView, recordVisit } from "@/lib/usage";

export default function AdjustPage() {
  const [selectedPalace, setSelectedPalace] = useState<PalaceKey>("中");

  useEffect(() => {
    recordVisit();
    recordAdjustView();
  }, []);

  return (
    <div>
      <PageHeader
        title="调局"
        eyebrow="当前板块 · 调局建议"
        description="命局有偏，取其所用；人事有阻，调其所处。"
      />

      <Card className="mb-6 border-gold-soft/80 bg-white/58">
        <p className="max-w-3xl text-sm leading-7 text-smoke">
          以下建议以命局、喜用、居住方位与近期动象合参，仅供自我整理与生活参考。
        </p>
      </Card>

      <section className="grid gap-6">
        <Card className="border-cinnabar/20 bg-cinnabar-soft/35">
          <p className="text-sm font-medium text-smoke">调局总断</p>
          <p className="mt-4 font-song text-2xl font-semibold leading-10 text-ink">{adjustOverview.summary}</p>
        </Card>

        <Card>
          <SectionTitle>调局总览</SectionTitle>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <KeyValue label="喜用方向" value={adjustOverview.usefulElements.join("、")} />
            <KeyValue label="适合色系" value={adjustOverview.colors} />
            <KeyValue label="有利方位" value={adjustOverview.directions} />
            <KeyValue label="当前动象" value={adjustOverview.movement} />
            <KeyValue label="今日建议" value={adjustOverview.today} />
          </div>
        </Card>

        <Card>
          <SectionTitle>喜用神调和</SectionTitle>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-smoke">
            当前以火、木为主要取象。重点不是迷信物件，而是让环境、行动和表达方式更贴合要做的事。
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-5">
            {Object.entries(elementAdjustments).map(([element, item]) => {
              const active = adjustOverview.usefulElements.includes(element);

              return (
                <article
                  className={`rounded-[24px] border p-5 transition ${
                    active
                      ? "border-cinnabar/25 bg-cinnabar-soft/30 shadow-card"
                      : "border-gold-soft/60 bg-white/36 opacity-70"
                  }`}
                  key={element}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-song text-3xl font-semibold text-ink">{element}</h3>
                    {active ? <span className="rounded-full bg-cinnabar px-2.5 py-1 text-xs text-white">当前喜用</span> : null}
                  </div>
                  <p className="mt-4 text-sm font-medium text-ink">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-smoke">{item.text}</p>
                  {active ? (
                    <div className="mt-4 grid gap-2">
                      {item.actions.map((action) => (
                        <p className="rounded-2xl border border-gold-soft/60 bg-white/50 px-3 py-2 text-sm leading-6 text-smoke" key={action}>
                          {action}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionTitle>阳宅方位</SectionTitle>
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid aspect-square max-w-md grid-cols-3 gap-2">
              {palaceGrid.flat().map((palace) => (
                <button
                  className={`rounded-2xl border px-3 py-4 text-center transition ${
                    selectedPalace === palace
                      ? "border-cinnabar/40 bg-cinnabar-soft/55 text-ink shadow-card"
                      : "border-gold-soft/80 bg-white/54 text-smoke hover:bg-white"
                  }`}
                  key={palace}
                  onClick={() => setSelectedPalace(palace)}
                  type="button"
                >
                  <span className="font-song text-2xl font-semibold">{palace}</span>
                  {selectedPalace === palace ? <span className="mt-2 block text-xs text-cinnabar">当前</span> : null}
                </button>
              ))}
            </div>
            <div className="grid content-start gap-4">
              <KeyValue label={selectedPalace} value={palaceDescriptions[selectedPalace]} />
              <div className="rounded-[24px] border border-gold-soft/70 bg-white/52 p-5">
                <p className="text-sm font-medium text-smoke">本位建议</p>
                <p className="mt-3 leading-8 text-ink">{rankingAdvice}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle>近期动象</SectionTitle>
          <div className="mt-5 rounded-[24px] border border-gold-soft/70 bg-white/52 p-5">
            <p className="font-song text-3xl font-semibold text-ink">驿马动</p>
            <p className="mt-4 leading-8 text-smoke">{movementAdvice}</p>
          </div>
        </Card>

        <Card>
          <SectionTitle>心法调局</SectionTitle>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {mindsetYaoAdvice.map((item) => (
              <article className="rounded-[24px] border border-gold-soft/70 bg-white/52 p-5" key={item.advice}>
                <p className="font-song text-2xl leading-9 text-ink">{item.advice}</p>
                <p className="mt-4 inline-flex rounded-full border border-gold-soft bg-white/64 px-3 py-1 font-song text-base text-ink">
                  {item.yao}
                </p>
                <p className="mt-4 text-sm leading-7 text-smoke">{item.plain}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 leading-8 text-smoke">{mindsetSummary}</p>
        </Card>
      </section>
    </div>
  );
}
