"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate } from "animejs";
import { clients, featuredClient, type ClientItem } from "@/data/content";
import { useDict } from "@/i18n/DictProvider";
import { useReveal } from "@/lib/useReveal";

const ROTATE_MS = 4000;
const allClients = [featuredClient, ...clients];

export default function Clients() {
  const { t } = useDict();
  const root = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<ClientItem>(featuredClient);
  const card = useRef<HTMLDivElement>(null);
  const pendingSelection = useRef<"user" | "auto" | null>(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  useReveal(root, { y: 16, step: 35 });

  const industries = t.content.clientIndustries as Record<string, string>;
  const descriptions = t.content.clientDescriptions as Record<string, string | undefined>;
  const isFeatured = selected.id === featuredClient.id;
  const selectedTitle = isFeatured ? t.content.featured.short : selected.short;

  // Rotate only while the section is on screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Advance to the next client every 4 s; a manual pick restarts the countdown.
  useEffect(() => {
    if (paused || !inView) return;
    const id = window.setTimeout(() => {
      const i = allClients.findIndex((c) => c.id === selected.id);
      pendingSelection.current = "auto";
      setSelected(allClients[(i + 1) % allClients.length]);
    }, ROTATE_MS);
    return () => window.clearTimeout(id);
  }, [selected, paused, inView]);

  // Animate a changed card; a user pick also brings it into view on narrow screens.
  useEffect(() => {
    const source = pendingSelection.current;
    if (!source) return;
    pendingSelection.current = null;
    const el = card.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const stacked = window.innerWidth < 1024;
    if (source === "user" && stacked && (rect.top < 80 || rect.top > window.innerHeight * 0.6)) {
      window.scrollTo({ top: window.scrollY + rect.top - 100, behavior: "smooth" });
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = animate(el, { opacity: [0.72, 1], duration: 320, ease: "outQuart" });
    return () => {
      animation.pause();
    };
  }, [selected]);

  return (
    <section ref={root} id="clients" aria-labelledby="clients-title" className="bg-ink py-20 text-paper lg:py-28">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="clients-title" data-reveal className="h-section">
            {t.clients.title}
          </h2>
          <p data-reveal className="max-w-[520px] text-[16px] text-paper/60">
            {t.clients.lead}
          </p>
        </div>

        <div
          data-reveal
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
          }}
          className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
          {/* selected client — kept outside the reveal so a state change never leaves it at opacity 0 */}
          <div
            ref={card}
            aria-live={paused ? "polite" : "off"}
            className="group relative flex h-full flex-col justify-between overflow-hidden border border-rule-inv bg-navy p-7 text-paper shadow-lg md:p-10"
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
                  <span
                    className={`block font-display font-bold leading-tight tracking-[-0.03em] text-primary [overflow-wrap:anywhere] ${
                      selectedTitle.length > 12 ? "text-[24px] sm:text-[28px]" : "text-[30px] sm:text-[40px]"
                    }`}
                  >
                    {selectedTitle}
                  </span>
                  <p className="mt-1 line-clamp-2 text-[14px] text-paper/70">{isFeatured ? t.content.featured.name : selected.name}</p>
                </div>
              </div>

              <p className="mt-6 text-[16px] leading-relaxed text-paper/85">
                {isFeatured ? t.content.featured.text : (descriptions[selected.id] ?? t.content.clientText)}
              </p>
            </div>
          </div>

          {/* logo grid */}
          <div className="border border-rule-inv bg-rule-inv">
            <ul className="grid grid-cols-2 gap-px bg-rule-inv sm:grid-cols-3 xl:grid-cols-4">
              {allClients.map((c) => {
                const isSelected = selected.id === c.id;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (isSelected) return;
                        pendingSelection.current = "user";
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
