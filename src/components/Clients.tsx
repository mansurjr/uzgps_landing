"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate } from "animejs";
import { clients, featuredClient, type ClientItem } from "@/data/content";
import { useDict } from "@/i18n/DictProvider";
import { useReveal } from "@/lib/useReveal";

export default function Clients() {
  const { t } = useDict();
  const root = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<ClientItem>(featuredClient);
  const card = useRef<HTMLDivElement>(null);
  const pendingSelection = useRef(false);
  useReveal(root, { y: 16, step: 35 });

  const allClients = [featuredClient, ...clients];
  const industries = t.content.clientIndustries as Record<string, string>;
  const isFeatured = selected.id === featuredClient.id;

  // Animate only a user-selected card, and bring it into view on narrow screens.
  useEffect(() => {
    if (!pendingSelection.current) return;
    pendingSelection.current = false;
    const el = card.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const stacked = window.innerWidth < 1024;
    if (stacked && (rect.top < 80 || rect.top > window.innerHeight * 0.6)) {
      window.scrollTo({ top: window.scrollY + rect.top - 100, behavior: "smooth" });
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = animate(el, { opacity: [0.72, 1], duration: 320, ease: "outQuart" });
    return () => {
      animation.pause();
    };
  }, [selected]);

  return (
    <section ref={root} id="clients" aria-labelledby="clients-title" className="border-t border-rule bg-white py-20 lg:py-28">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="clients-title" data-reveal className="h-section">
            {t.clients.title}
          </h2>
          <p data-reveal className="max-w-[520px] text-[16px] text-graphite">
            {t.clients.lead}
          </p>
        </div>

        <div data-reveal className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
          {/* selected client — kept outside the reveal so a state change never leaves it at opacity 0 */}
          <div
            ref={card}
            aria-live="polite"
            className="group relative flex h-full flex-col justify-between overflow-hidden border border-ink/20 bg-navy p-7 text-paper shadow-lg md:p-10"
          >
            <div>
              <span className="text-[14px] text-paper/60">{industries[selected.id]}</span>

              <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* every selected logo gets the same large tile */}
                <div className="relative flex size-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-md md:size-40">
                  <Image
                    src={selected.logo}
                    alt={selected.short}
                    width={selected.w}
                    height={selected.h}
                    unoptimized
                    className="size-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <span className="font-display text-[30px] font-bold leading-tight tracking-[-0.03em] text-primary sm:text-[40px]">
                    {isFeatured ? t.content.featured.short : selected.short}
                  </span>
                  <p className="mt-1 line-clamp-2 text-[14px] text-paper/70">{isFeatured ? t.content.featured.name : selected.name}</p>
                </div>
              </div>

              <p className="mt-6 text-[16px] leading-relaxed text-paper/85">
                {isFeatured ? t.content.featured.text : t.content.clientText}
              </p>
            </div>
          </div>

          {/* logo grid */}
          <div className="border border-rule bg-rule">
            <ul className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-3 xl:grid-cols-4">
              {allClients.map((c) => {
                const isSelected = selected.id === c.id;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (isSelected) return;
                        pendingSelection.current = true;
                        setSelected(c);
                      }}
                      aria-pressed={isSelected}
                      title={c.name}
                      className={`group relative flex aspect-[3/2] w-full items-center justify-center p-4 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy ${
                        isSelected ? "z-10 bg-white shadow-md ring-2 ring-inset ring-primary" : "bg-paper hover:z-10 hover:bg-white"
                      }`}
                    >
                      <Image
                        src={c.logo}
                        alt={c.name}
                        width={c.w}
                        height={c.h}
                        unoptimized
                        className={`h-auto max-h-16 w-auto max-w-full transition duration-300 ${
                          isSelected ? "opacity-100 grayscale-0" : "opacity-75 grayscale group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                        }`}
                      />
                      {isSelected && <span className="absolute bottom-1 right-1.5 size-2 rounded-full bg-primary" />}
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
