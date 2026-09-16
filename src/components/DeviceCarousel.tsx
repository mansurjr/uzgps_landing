"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, stagger } from "animejs";
import { devices, type DeviceModel } from "@/data/content";
import { useDict } from "@/i18n/DictProvider";

const AUTOPLAY_MS = 6000;
const SWIPE_PX = 40;

const pad = (n: number) => String(n).padStart(2, "0");

export default function DeviceCarousel() {
  const { t } = useDict();
  const copy = (model: DeviceModel) => t.content.devices[model];
  const name = (model: DeviceModel) => {
    const item = copy(model);
    return "label" in item ? item.label : model;
  };
  const hasWhitePhotoBackground = (model: DeviceModel) =>
    model === "Реле блокировки" || model === "Замки Jointech";
  const [index, setIndex] = useState(0);
  const dirRef = useRef<1 | -1>(1);
  const pausedRef = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const info = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const thumbs = useRef<HTMLUListElement>(null);
  const progress = useRef<ReturnType<typeof animate> | null>(null);
  const touchX = useRef(0);
  const firstRun = useRef(true);

  const device = devices[index];

  const goTo = useCallback((i: number, dir?: 1 | -1) => {
    setIndex((cur) => {
      const next = (i + devices.length) % devices.length;
      if (next === cur) return cur;
      dirRef.current = dir ?? (next > cur ? 1 : -1);
      return next;
    });
  }, []);

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  // slide transition: product and background model name travel in from the side we're moving towards
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (firstRun.current || reduce) {
      firstRun.current = false;
    } else {
      const d = dirRef.current;
      const s = stage.current!;
      animate(s.querySelector("[data-ghost]")!, { translateX: [160 * d, 0], opacity: [0, 1], duration: 1100, ease: "outQuart" });
      animate(info.current!.querySelectorAll("[data-info]"), {
        translateY: [18, 0],
        opacity: [0, 1],
        duration: 650,
        delay: stagger(55, { start: 80 }),
        ease: "outQuart",
      });
    }

    // keep the active thumbnail visible in the strip on small screens
    const t = thumbs.current?.children[index] as HTMLElement | undefined;
    const strip = thumbs.current;
    if (t && strip && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: t.offsetLeft - strip.clientWidth / 2 + t.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
    }

    // autoplay is driven by the progress bar itself, so the bar and the slide change never drift apart
    if (reduce || !bar.current) return;
    progress.current?.pause();
    progress.current = animate(bar.current, {
      scaleX: [0, 1],
      duration: AUTOPLAY_MS,
      ease: "linear",
      autoplay: !pausedRef.current,
      onComplete: () => goTo(index + 1, 1),
    });
    return () => {
      progress.current?.pause();
    };
  }, [index, goTo]);

  const pause = () => {
    pausedRef.current = true;
    progress.current?.pause();
  };
  const resume = () => {
    pausedRef.current = false;
    progress.current?.resume();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t.equipment.carousel.title}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onKeyDown={onKey}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h3 className="font-display text-[clamp(28px,3vw,40px)] leading-tight tracking-[-0.03em]">{t.equipment.carousel.title}</h3>
          <p className="mt-2 max-w-[520px] text-[16px] text-paper/60">{t.equipment.carousel.lead}</p>
        </div>
        <p className="num text-[15px] text-paper/50" aria-live="polite">
          <span className="text-paper">{pad(index + 1)}</span> / {pad(devices.length)}
        </p>
      </div>

      <div className="mt-10 grid border border-rule-inv lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        {/* stage */}
        <div
          ref={stage}
          className={`relative aspect-[4/3] overflow-hidden sm:aspect-[16/10] lg:aspect-auto lg:min-h-[520px] ${hasWhitePhotoBackground(device.model) ? "bg-white" : "bg-[linear-gradient(160deg,#f4f6f9_0%,#dde5ee_100%)]"}`}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > SWIPE_PX) (dx < 0 ? next : prev)();
          }}
        >
          <span
            data-ghost
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-[-0.12em] select-none whitespace-nowrap text-center font-display text-[clamp(96px,17vw,240px)] font-semibold leading-none tracking-[-0.06em] text-navy/[0.07]"
          >
            {name(device.model)}
          </span>
          {/* Keep each image mounted so slide changes use cached assets. */}
          <div data-product className="absolute inset-[8%]">
            {devices.map((d, i) => (
              <Image
                key={d.model}
                src={d.image}
                alt={i === index ? name(d.model) : ""}
                aria-hidden={i !== index}
                fill
                priority={i === 0}
                sizes="(min-width:1024px) 720px, 100vw"
                className={`object-contain transition-[opacity,transform] ease-out ${hasWhitePhotoBackground(d.model) ? "" : "drop-shadow-[0_24px_30px_rgba(10,26,48,.22)]"} ${i === index ? "scale-100 opacity-100 duration-500" : "scale-[.96] opacity-0 duration-0"}`}
              />
            ))}
          </div>

          <div className="absolute bottom-4 right-4 flex">
            <button
              type="button"
              onClick={prev}
              aria-label={t.equipment.carousel.prev}
              className="grid size-12 place-items-center border border-ink bg-paper text-[20px] text-ink transition-colors hover:bg-navy hover:text-paper"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t.equipment.carousel.next}
              className="-ml-px grid size-12 place-items-center border border-ink bg-paper text-[20px] text-ink transition-colors hover:bg-navy hover:text-paper"
            >
              →
            </button>
          </div>

          {/* autoplay progress */}
          <span className="absolute inset-x-0 top-0 h-[3px] bg-navy/10">
            <span ref={bar} className="block h-full origin-left scale-x-0 bg-primary" />
          </span>
        </div>

        {/* details */}
        <div ref={info} className="flex flex-col border-t border-rule-inv p-6 md:p-10 lg:border-l lg:border-t-0">
          <p data-info className="text-[15px] text-primary">
            {copy(device.model).title}
          </p>
          <h4 data-info className="num mt-2 break-words font-display text-[clamp(34px,3.5vw,60px)] font-medium leading-[1.05] tracking-[-0.04em]">
            {name(device.model)}
          </h4>
          <p data-info className="mt-6 text-[17px] leading-relaxed text-paper/70">
            {copy(device.model).text}
          </p>

          {copy(device.model).specs.length > 0 && (
            <dl data-info className="mt-8 grid grid-cols-2 border-t border-rule-inv">
              {copy(device.model).specs.map((s, i) => (
                <div
                  key={s}
                  className={`border-b border-rule-inv py-3.5 text-[15px] text-paper/85 ${i % 2 ? "pl-4" : "border-r pr-4"}`}
                >
                  <dt className="sr-only">{t.common.spec}</dt>
                  <dd>{s}</dd>
                </div>
              ))}
            </dl>
          )}

          <div data-info className="mt-auto pt-10">
            <a href="#contact" className="btn-primary w-full sm:w-auto">{t.equipment.carousel.cta}</a>
          </div>
        </div>
      </div>

      {/* thumbnails */}
      <ul
        ref={thumbs}
        role="tablist"
        aria-label={t.equipment.carousel.tablist}
        className="mt-px flex overflow-x-auto border-x border-b border-rule-inv [scrollbar-color:#477197_#162b42] [scrollbar-width:thin]"
      >
        {devices.map((d, i) => {
          const active = i === index;
          return (
            <li key={d.model} className="w-[40%] shrink-0 border-r border-rule-inv last:border-r-0 sm:w-[26%] lg:w-1/6">
              <button
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`${name(d.model)} — ${copy(d.model).title}`}
                onClick={() => goTo(i)}
                className={`group relative flex w-full flex-col items-center gap-2 px-3 pb-4 pt-5 transition-colors ${
                  active ? "bg-paper/[0.06]" : "hover:bg-paper/[0.03]"
                }`}
              >
                <span className={`absolute inset-x-0 top-0 h-[3px] transition-colors ${active ? "bg-primary" : "bg-transparent"}`} />
                {/* light tile so the dark device renders stay readable on the dark section */}
                <span
                  className={`relative block aspect-[3/2] w-full transition-opacity duration-300 ${hasWhitePhotoBackground(d.model) ? "bg-white" : "bg-[#e7ecf2]"} ${
                    active ? "opacity-100" : "opacity-50 group-hover:opacity-85"
                  }`}
                >
                  {/* same URL as the slide, so this is served from cache */}
                  <Image src={d.image} alt="" fill sizes="160px" className="object-contain p-1.5" />
                </span>
                <span className={`num min-h-10 text-center text-[14px] leading-5 transition-colors ${active ? "text-paper" : "text-paper/50"}`}>{name(d.model)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
