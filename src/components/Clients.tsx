"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, stagger } from "animejs";
import { clients, featuredClient, type ClientItem } from "@/data/content";
import { useReveal } from "@/lib/useReveal";

export default function Clients() {
  const root = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<ClientItem>(featuredClient);
  const card = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useReveal(root, { y: 16, step: 35 });

  const allClients = [featuredClient, ...clients];

  // grow the picked logo into the big card; on narrow screens the card sits above the grid, so bring it into view
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = card.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const stacked = window.innerWidth < 1024;
    if (stacked && (rect.top < 80 || rect.top > window.innerHeight * 0.6)) {
      window.scrollTo({ top: window.scrollY + rect.top - 100, behavior: "smooth" });
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anims = [
      animate(el.querySelector("[data-feature-logo]")!, { scale: [0.55, 1], opacity: [0, 1], duration: 650, ease: "outBack(1.4)" }),
      animate(el.querySelectorAll("[data-feature-text]"), { opacity: [0, 1], translateY: [14, 0], duration: 550, delay: stagger(70, { start: 120 }), ease: "outQuart" }),
    ];
    return () => anims.forEach((a) => a.pause());
  }, [selected]);

  return (
    <section ref={root} id="clients" aria-labelledby="clients-title" className="border-t border-rule bg-white py-20 lg:py-28">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="clients-title" data-reveal className="h-section mt-1">
              Нам доверяют
            </h2>
          </div>
          <p data-reveal className=" text-[16px] text-graphite">
            Государственные службы, банки, промышленность и бизнес по всему Узбекистану. Нажмите на логотип, чтобы узнать подробнее.
          </p>
        </div>

        <div data-reveal className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
          {/* Featured / Selected client card (Left Side - Big View) - NO data-reveal on dynamic child to prevent opacity:0 on state change */}
          <div ref={card} aria-live="polite" className="group relative flex flex-col justify-between overflow-hidden border border-ink/20 bg-navy p-7 text-paper shadow-lg transition-all duration-300 md:p-10 h-full">

            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[14px] text-paper/60">
                  {selected.industry}
                </span>
                {selected.stats && (
                  <span className="text-[12px] font-medium text-paper/60">
                    {selected.stats}
                  </span>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* every selected logo gets the same large tile the 103 logo has */}
                <div
                  data-feature-logo
                  className="relative flex size-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-md md:size-40"
                >
                  <Image
                    key={selected.logo}
                    src={selected.logo}
                    alt={selected.short || selected.name}
                    width={selected.w || 160}
                    height={selected.h || 160}
                    unoptimized
                    className="size-full object-contain"
                  />
                </div>
                <div data-feature-text className="min-w-0">
                  <span className="font-display text-[30px] font-bold leading-tight tracking-[-0.03em] text-primary sm:text-[40px]">
                    {selected.short}
                  </span>
                  <p className="mt-1 line-clamp-2 text-[14px] text-paper/70">{selected.name}</p>
                </div>
              </div>

              <p data-feature-text className="mt-6 text-[16px] leading-relaxed text-paper/85">
                {selected.text}
              </p>
            </div>

          </div>

          {/* Client Logos Grid (Right Side) */}
          <div className="border border-rule bg-rule">
            <ul className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-3 xl:grid-cols-4">
              {allClients.map((c) => {
                const isSelected = selected.id === c.id;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      aria-pressed={isSelected}
                      title={`${c.name} — кликните для деталей`}
                      className={`group relative flex aspect-[3/2] w-full items-center justify-center p-4 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy ${
                        isSelected
                          ? "bg-white ring-2 ring-primary ring-inset z-10 shadow-md"
                          : "bg-paper hover:bg-white hover:z-10"
                      }`}
                    >
                      <Image
                        src={c.logo}
                        alt={c.name}
                        width={c.w}
                        height={c.h}
                        unoptimized
                        className={`h-auto max-h-16 w-auto max-w-full transition duration-300 ${
                          isSelected
                            ? "opacity-100 grayscale-0 scale-110"
                            : "opacity-75 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105"
                        }`}
                      />
                      {isSelected && (
                        <span className="absolute bottom-1 right-1.5 size-2 rounded-full bg-primary" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
