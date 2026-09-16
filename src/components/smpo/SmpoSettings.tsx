"use client";

import { useState } from "react";
import PlateNumber, { type Plate } from "./PlateNumber";
import { AppShell, Btn, Checkbox, Field, ScaledScreen, T } from "./shared";
import TablerIcon from "./TablerIcon";

/*
 * Replica of «Настройки Объектов» (smn-web/src/domains/smn/settings/pages/objectSettings):
 * ObjectList card + SectionCard blocks (Основные данные, Значок, Скорость и интервалы).
 */

const objects: { id: number; name: string; icon: string; plate: Plate }[] = [
  { id: 1, name: "Фургон", icon: "truck", plate: { type: 1, region: "01", numbers: "714", symbols: "UZA" } },
  { id: 2, name: "Грузовой автомобиль", icon: "gruzovik", plate: { type: 3, region: "10", letter: "C", numbers: "551", symbols: "AA" } },
  { id: 3, name: "Легковой автомобиль", icon: "taxi", plate: { type: 3, region: "01", letter: "B", numbers: "208", symbols: "GP" } },
  { id: 4, name: "Пикап", icon: "pickup2", plate: { type: 1, region: "01", numbers: "390", symbols: "KBA" } },
  { id: 5, name: "Автобус", icon: "bus", plate: { type: 1, region: "01", numbers: "067", symbols: "MAA" } },
  { id: 6, name: "Экскаватор", icon: "excavator", plate: { type: 1, region: "01", numbers: "925", symbols: "TTA" } },
];

const icons = ["gruzovik", "truck", "taxi", "pickup2", "bus", "ambulance", "excavator", "tructor", "crane", "garbage_truck", "combain", "sisterna"];

// LIMIT_FIELDS from smn-web/src/domains/smn/settings/pages/objectSettings/constants.ts
const limits = [
  { label: "Максимально допустимая скорость", value: "70", unit: "км/ч" },
  { label: "Средняя скорость", value: "45", unit: "км/ч" },
  { label: "Интервал «потеря связи»", value: "300", unit: "сек" },
  { label: "Интервал долгая «потеря связи»", value: "3600", unit: "сек" },
  { label: "Состояние «Парковка» при остановке на", value: "180", unit: "сек" },
];

export default function SmpoSettings() {
  const [selected, setSelected] = useState(2);
  const [icon, setIcon] = useState("gruzovik");
  const obj = objects.find((o) => o.id === selected)!;

  return (
    <ScaledScreen>
      <AppShell active="settings" activeChild="Настройки Объектов" title="Настройки Объектов">
        <div className="flex h-full gap-5">
          {/* ObjectList */}
          <div className="flex w-[330px] shrink-0 flex-col overflow-hidden rounded-md bg-white" style={{ boxShadow: T.cardShadow }}>
            <div className="flex items-center gap-2 px-4 pb-2 pt-4">
              <span className="text-[18px] font-bold">Объекты</span>
              <span className="rounded px-2 py-0.5 text-[12px] font-medium" style={{ background: `${T.primary}29`, color: T.primary }}>
                6 / 6
              </span>
            </div>
            <div className="px-3 pb-2">
              <div className="flex h-[38px] items-center gap-2 rounded-md border px-3 text-[15px]" style={{ borderColor: T.border, color: T.secondary }}>
                <TablerIcon name="search" size={18} /> Поиск: имя или госномер
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 pb-2 text-[14px]" style={{ color: T.secondary }}>
              <Checkbox checked={false} indeterminate /> Выбрать все
              <span className="ml-auto rounded px-2 py-0.5 text-[12px] font-medium" style={{ background: `${T.warning}29`, color: T.warning }}>
                Отмечено: 2
              </span>
            </div>
            <div className="h-px bg-black/10" />
            <ul className="flex-1 overflow-hidden">
              {objects.map((o) => {
                const on = o.id === selected;
                return (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(o.id)}
                      className="flex w-full items-center gap-2.5 border-b px-3 py-2.5 text-left"
                      style={{ borderColor: "rgba(47,43,61,.08)", background: on ? "rgba(35,72,125,.08)" : undefined, borderLeft: `3px solid ${on ? T.primary : "transparent"}` }}
                    >
                      <Checkbox checked={o.id === 2 || o.id === 3} />
                      {/* eslint-disable-next-line @next/next/no-img-element -- СМПО object icon */}
                      <img src={`/vehicles/${o.icon}.png`} alt="" className="h-[30px] w-[15px] object-contain" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px]">{o.name}</span>
                      </span>
                      <PlateNumber plate={o.plate} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* sections */}
          <div className="min-w-0 flex-1 space-y-5 overflow-hidden">
            <SectionCard index={1} title="Основные данные" dirty>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Наименование объекта" value={obj.name} />
                <Field label="Доп. информация" value="Смена 1, колонна №2" />
              </div>
              <div className="mt-4 rounded-md border p-4" style={{ borderColor: T.border, background: T.background }}>
                <div className="mb-3 flex items-center gap-2 text-[12px] font-medium uppercase" style={{ color: "rgba(47,43,61,.55)" }}>
                  <TablerIcon name="lock" size={14} /> Данные из системы
                </div>
                <div className="grid grid-cols-4 gap-x-6 gap-y-3 text-[14px]">
                  <Readonly label="Госномер">
                    <PlateNumber plate={obj.plate} />
                  </Readonly>
                  <Readonly label="Марка">Грузовой</Readonly>
                  <Readonly label="Грузоподъемность">5 т</Readonly>
                  <Readonly label="Топливо">Дизель</Readonly>
                  <Readonly label="Тарировка топл. бака">200 л</Readonly>
                  <Readonly label="Тип">Грузовой</Readonly>
                  <Readonly label="Назначение">Перевозки</Readonly>
                  <Readonly label="Состояние">Исправен</Readonly>
                </div>
              </div>
            </SectionCard>

            <SectionCard index={2} title="Значок">
              <div className="flex gap-2">
                {icons.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    className="grid h-[70px] w-[54px] place-items-center rounded-md border-2 bg-white"
                    style={{ borderColor: icon === i ? T.primary : "rgba(47,43,61,.12)", background: icon === i ? "rgba(35,72,125,.08)" : "#fff" }}
                    aria-label={i}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- СМПО object icon */}
                    <img src={`/vehicles/${i}.png`} alt="" className="h-[52px] w-[26px] object-contain" />
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard index={4} title="Скорость и интервалы">
              <div className="grid grid-cols-3 gap-x-5 gap-y-4">
                {limits.map((l) => (
                  <div key={l.label}>
                    <div className="mb-2 truncate text-[14px]">{l.label}</div>
                    <div className="flex items-center gap-2">
                      <span className="grid size-[38px] shrink-0 place-items-center rounded-lg" style={{ background: "rgba(47,43,61,.08)" }}>
                        <TablerIcon name="minus" size={18} />
                      </span>
                      <Field value={l.value} suffix={l.unit} className="flex-1" />
                      <span className="grid size-[38px] shrink-0 place-items-center rounded-lg" style={{ background: "rgba(47,43,61,.08)" }}>
                        <TablerIcon name="plus" size={18} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </AppShell>
    </ScaledScreen>
  );
}

function SectionCard({ index, title, dirty, children }: { index: number; title: string; dirty?: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-white" style={{ boxShadow: T.cardShadow }}>
      <div className="flex items-center gap-2 px-6 pb-2 pt-5">
        <span className="text-[17px] font-medium">
          {index}. {title}
        </span>
        {dirty && <span className="size-2 rounded-full" style={{ background: T.warning }} title="Есть несохранённые изменения" />}
        <span className="ml-auto flex gap-2">
          <Btn variant="tonal">
            Применить к выбранным
            <span className="rounded px-1.5 text-[12px] text-white" style={{ background: T.primary }}>2</span>
          </Btn>
          <Btn>Сохранить</Btn>
        </span>
      </div>
      <div className="px-6 pb-5 pt-2">{children}</div>
    </div>
  );
}

function Readonly({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 truncate text-[12px]" style={{ color: "rgba(47,43,61,.55)" }}>{label}</div>
      <div className="truncate" style={{ color: T.onSurface }}>{children}</div>
    </div>
  );
}
