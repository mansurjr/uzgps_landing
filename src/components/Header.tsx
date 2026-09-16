"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, stagger } from "animejs";
import { contacts, industries } from "@/data/content";

const links = [
  { href: "#platform", label: "Платформа" },
  { href: "#equipment", label: "Оборудование" },
  { href: "#calculator", label: "Экономия" },
  { href: "#about", label: "О компании" },
];

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <Image src="/brand/pin.svg" alt="" width={20} height={32} priority className={inverted ? "brightness-0 invert" : ""} />
      <span className={`font-display text-[22px] font-semibold leading-none tracking-[-0.04em] ${inverted ? "" : "text-navy"}`}>UZGPS</span>
    </span>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [sheet, setSheet] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(false);
        setSheet(false);
      }
    };
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("keydown", esc);
    };
  }, []);

  useEffect(() => {
    if (!mega || !megaRef.current) return;
    const a = animate(megaRef.current.querySelectorAll("[data-mega-item]"), {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 450,
      delay: stagger(25),
      ease: "outQuart",
    });
    return () => {
      a.pause();
    };
  }, [mega]);

  useEffect(() => {
    document.documentElement.style.overflow = sheet ? "hidden" : "";
    if (!sheet || !sheetRef.current) return;
    const a = animate(sheetRef.current.querySelectorAll("[data-sheet-item]"), {
      opacity: [0, 1],
      translateX: [-16, 0],
      duration: 500,
      delay: stagger(40, { start: 80 }),
      ease: "outQuart",
    });
    return () => {
      a.pause();
    };
  }, [sheet]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMegaSoon = () => {
    closeTimer.current = window.setTimeout(() => setMega(false), 140);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* utility row collapses once the page scrolls */}
      <div
        className={`hidden overflow-hidden bg-ink text-paper/70 transition-[height] duration-300 lg:block ${
          scrolled ? "h-0" : "h-9"
        }`}
      >
        <div className="wrap flex h-9 items-center justify-between text-[13px]">
          <span>Ташкент, ул. Кирк Киз, 10</span>
          <div className="flex items-center gap-6">
            <span>
              Техподдержка: <a href="tel:+998712305544" className="text-paper hover:text-primary">(71) 230-55-44</a>
            </span>
            <a href={contacts.telegram} target="_blank" rel="noreferrer" className="hover:text-primary">
              Telegram
            </a>
            <span className="flex gap-2">
              <span className="text-paper">RU</span>
              <span className="text-paper/30">/</span>
              <a href="https://uzgps.uz/uz" className="hover:text-primary">
                UZ
              </a>
            </span>
          </div>
        </div>
      </div>

      <div
        className={`relative border-b bg-white transition-colors duration-300 ${scrolled || mega ? "border-rule" : "border-transparent"}`}
        onMouseLeave={closeMegaSoon}
      >
        <div className="wrap flex h-[76px] items-center gap-8 whitespace-nowrap xl:gap-12">
          <a href="#top" aria-label="UZGPS — на главную" className="shrink-0">
            <Logo />
          </a>

          <nav className="hidden h-full items-stretch gap-7 lg:flex" aria-label="Основное меню">
            <button
              type="button"
              aria-expanded={mega}
              aria-controls="mega"
              onMouseEnter={openMega}
              onClick={() => setMega((m) => !m)}
              className={`relative flex items-center gap-1.5 text-[15px] transition-colors hover:text-ink ${mega ? "text-ink" : "text-ink/75"}`}
            >
              Решения
              <svg width="10" height="6" viewBox="0 0 10 6" className={`transition-transform ${mega ? "rotate-180" : ""}`} aria-hidden>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              <span className={`absolute inset-x-0 bottom-0 h-[3px] bg-primary transition-transform ${mega ? "scale-x-100" : "scale-x-0"}`} />
            </button>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onMouseEnter={closeMegaSoon}
                className="group relative flex items-center text-[15px] text-ink/75 transition-colors hover:text-ink"
              >
                {l.label}
                <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-6 lg:flex">
            <a href={contacts.salesHref} className="hidden text-right leading-tight xl:block">
              <span className="block text-[12px] text-graphite">Отдел продаж</span>
              <span className="num block text-[16px] font-semibold">{contacts.sales}</span>
            </a>
            <a href="#contact" className="btn-primary !py-3">
              Оставить заявку
            </a>
          </div>

          <button
            type="button"
            className="ml-auto flex h-11 items-center gap-3 text-[15px] font-medium lg:hidden"
            onClick={() => setSheet(true)}
            aria-label="Открыть меню"
          >
            Меню
            <span className="flex w-6 flex-col gap-1.5" aria-hidden>
              <span className="h-[2px] bg-ink" />
              <span className="h-[2px] bg-ink" />
            </span>
          </button>
        </div>

        {/* mega menu */}
        {mega && (
          <div
            id="mega"
            ref={megaRef}
            onMouseEnter={openMega}
            className="absolute inset-x-0 top-full hidden border-b border-rule bg-white shadow-[0_24px_40px_-24px_rgba(17,19,21,.25)] lg:block"
          >
            <div className="wrap grid grid-cols-[1fr_1fr_320px] gap-12 py-10">
              <div>
                <p data-mega-item className="text-[13px] text-graphite">
                  По отраслям
                </p>
                <ul className="mt-4">
                  {industries.map((it) => (
                    <li key={it.title} data-mega-item>
                      <a
                        href="#solutions"
                        onClick={() => setMega(false)}
                        className="group flex items-center justify-between border-b border-rule py-3 text-[16px] hover:text-ink"
                      >
                        {it.title}
                        <span className="text-graphite transition-transform group-hover:translate-x-1">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p data-mega-item className="text-[13px] text-graphite">
                  Размещение
                </p>
                <ul className="mt-4 space-y-6">
                  <li data-mega-item>
                    <a href="#solutions" onClick={() => setMega(false)} className="block">
                      <span className="text-[16px] font-medium">Облачное решение</span>
                      <span className="mt-1 block text-[14px] text-graphite">Без собственного сервера. Работа из браузера и приложения.</span>
                    </a>
                  </li>
                  <li data-mega-item>
                    <a href="#solutions" onClick={() => setMega(false)} className="block">
                      <span className="text-[16px] font-medium">Серверное решение</span>
                      <span className="mt-1 block text-[14px] text-graphite">СМПО на вашей инфраструктуре, от 500 до 10 000 машин.</span>
                    </a>
                  </li>
                  <li data-mega-item>
                    <a href="#solutions" onClick={() => setMega(false)} className="block">
                      <span className="text-[16px] font-medium">Для провайдеров телематики</span>
                      <span className="mt-1 block text-[14px] text-graphite">Своя платформа мониторинга под вашим брендом.</span>
                    </a>
                  </li>
                </ul>
              </div>
              <a
                data-mega-item
                href="#calculator"
                onClick={() => setMega(false)}
                className="flex flex-col justify-between bg-ink p-7 text-paper"
              >
                <span className="font-display text-[26px] leading-tight tracking-[-0.03em]">
                  Сколько вы потеряли на топливе в прошлом месяце?
                </span>
                <span className="mt-8 text-primary">Посчитать за минуту →</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* mobile sheet */}
      {sheet && (
        <div ref={sheetRef} className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden" role="dialog" aria-modal="true" aria-label="Меню">
          <div className="wrap flex h-[76px] shrink-0 items-center justify-between border-b border-rule">
            <Logo />
            <button type="button" onClick={() => setSheet(false)} className="flex h-11 items-center gap-3 text-[15px] font-medium">
              Закрыть
              <span className="relative block size-5" aria-hidden>
                <span className="absolute left-0 top-1/2 h-[2px] w-5 rotate-45 bg-ink" />
                <span className="absolute left-0 top-1/2 h-[2px] w-5 -rotate-45 bg-ink" />
              </span>
            </button>
          </div>
          <nav className="wrap flex-1 overflow-y-auto py-6">
            {[{ href: "#solutions", label: "Решения" }, ...links].map((l) => (
              <a
                key={l.href}
                data-sheet-item
                href={l.href}
                onClick={() => setSheet(false)}
                className="flex items-center justify-between border-b border-rule py-4 font-display text-[28px] tracking-[-0.03em]"
              >
                {l.label}
                <span className="text-[18px] text-graphite">→</span>
              </a>
            ))}
          </nav>
          <div className="wrap shrink-0 space-y-3 border-t border-rule py-5">
            <a href={contacts.salesHref} className="num block text-[20px] font-semibold">
              {contacts.sales}
            </a>
            <a href="#contact" onClick={() => setSheet(false)} className="btn-primary w-full">
              Оставить заявку
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
