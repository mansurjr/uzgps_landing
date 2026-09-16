"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate } from "animejs";
import { contacts } from "@/data/content";
import { locales } from "@/i18n";
import { useDict } from "@/i18n/DictProvider";
import { localePath } from "@/lib/site";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <Image src="/brand/pin.svg" alt="" width={20} height={32} priority className={inverted ? "brightness-0 invert" : ""} />
      <span className={`font-display text-[22px] font-semibold leading-none tracking-[-0.04em] ${inverted ? "" : "text-navy"}`}>UZGPS</span>
    </span>
  );
}

export default function Header() {
  const { t, locale } = useDict();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [sheet, setSheet] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const links = [
    { href: "#platform", label: t.nav.platform },
    { href: "#equipment", label: t.nav.equipment },
    { href: "#calculator", label: t.nav.savings },
    { href: "#about", label: t.nav.about },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!sheet) return;
    const previousOverflow = document.documentElement.style.overflow;
    const menuButton = menuButtonRef.current;
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSheet(false);
        return;
      }
      if (event.key !== "Tab" || !sheetRef.current) return;
      const focusable = sheetRef.current.querySelectorAll<HTMLElement>("a, button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setSheet(false);
    };
    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", closeOnDesktop);
      menuButton?.focus();
    };
  }, [sheet]);

  useEffect(() => {
    if (!mega || !megaRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anim = animate(megaRef.current, {
      opacity: [0, 1],
      translateY: [-10, 0],
      scale: [0.98, 1],
      duration: 350,
      ease: "outQuart",
    });
    return () => {
      anim.pause();
    };
  }, [mega]);

  useEffect(() => {
    if (!sheet || !sheetRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anim = animate(sheetRef.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      scale: [0.97, 1],
      duration: 400,
      ease: "outQuart",
    });
    return () => {
      anim.pause();
    };
  }, [sheet]);

  useEffect(() => {
    if (!mega) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMega(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [mega]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMegaSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(false), 160);
  };

  return (
    <header className={`site-header pointer-events-none fixed inset-x-0 top-0 z-50 ${scrolled ? "is-scrolled" : ""}`}>
      <div
        className="glass-nav pointer-events-auto relative mx-auto flex h-[64px] w-full items-center gap-3 px-4 sm:h-[68px] sm:px-5 xl:gap-5"
        onMouseLeave={closeMegaSoon}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setMega(false);
        }}
      >
        <a href="#top" aria-label="UZGPS" className="relative z-10 shrink-0 translate-y-[2px] rounded-lg" onClick={() => setMega(false)}>
          <Logo />
        </a>

        <nav className="ml-auto hidden items-center gap-0.5 xl:flex" aria-label={t.nav.label}>
          <button
            type="button"
            aria-expanded={mega}
            aria-controls="mega"
            onClick={() => setMega((current) => !current)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                openMega();
                requestAnimationFrame(() => megaRef.current?.querySelector<HTMLAnchorElement>("a")?.focus());
              }
            }}
            className={`nav-pill flex items-center gap-1.5 ${mega ? "nav-pill-active" : ""}`}
          >
            {t.nav.solutions}
            <svg width="10" height="6" viewBox="0 0 10 6" className={`transition-transform ${mega ? "rotate-180" : ""}`} aria-hidden>
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>

          {mega && (
            <div id="mega" ref={megaRef} onMouseEnter={openMega} className="glass-panel absolute inset-x-0 top-[calc(100%+10px)] grid grid-cols-[1fr_1fr_260px] gap-8 rounded-[24px] p-8">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-graphite">{t.nav.megaIndustries}</p>
                <ul className="mt-3">
                  {t.content.industries.slice(0, 6).map((item) => (
                    <li key={item.title}>
                      <a href="#solutions" onClick={() => setMega(false)} className="group flex items-center justify-between border-b border-rule px-2 py-2.5 text-[15px] text-ink transition-colors hover:bg-navy/5 hover:text-navy">
                        {item.title}
                        <span className="text-primary transition-transform group-hover:translate-x-1">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-graphite">{t.nav.megaDeployment}</p>
                <ul className="mt-4 space-y-5">
                  {[t.nav.megaCloud, t.nav.megaServer, t.nav.megaProvider].map((item) => (
                    <li key={item.title}>
                      <a href="#solutions" onClick={() => setMega(false)} className="group block rounded-lg px-2 py-1 transition-colors hover:bg-navy/5">
                        <span className="text-[15px] font-semibold text-ink group-hover:text-navy">{item.title}</span>
                        <span className="mt-1 block text-[13px] leading-snug text-graphite">{item.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#calculator" onClick={() => setMega(false)} className="flex flex-col justify-between rounded-[18px] bg-navy p-6 text-paper">
                <span className="font-display text-[24px] leading-tight tracking-[-0.03em]">{t.nav.megaCta.title}</span>
                <span className="mt-8 font-medium text-primary">{t.nav.megaCta.action}</span>
              </a>
            </div>
          )}

          {links.map((link) => (
            <a key={link.href} href={link.href} onMouseEnter={closeMegaSoon} onClick={() => setMega(false)} className="nav-pill">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-2 xl:flex">
          <a href={contacts.salesHref} className="num mr-2 hidden text-[14px] font-semibold text-navy hover:text-primary 2xl:block">
            {contacts.sales}
          </a>
          <a href={contacts.login} target="_blank" rel="noreferrer" className="nav-pill font-semibold">
            {t.common.login}
          </a>
          <a href="#contact" className="nav-request">
            {t.common.request}
            <span aria-hidden>↗</span>
          </a>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="ml-auto flex size-11 items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-navy transition-colors hover:bg-navy/10 xl:hidden"
          onClick={() => setSheet(true)}
          aria-label={t.common.menu}
          aria-expanded={sheet}
          aria-controls="mobile-menu"
        >
          <span className="hidden sm:inline">{t.common.menu}</span>
          <span className="flex w-5 flex-col gap-1.5" aria-hidden>
            <span className="h-[2px] rounded-full bg-navy" />
            <span className="h-[2px] rounded-full bg-navy" />
          </span>
        </button>
      </div>

      {sheet && (
        <div className="pointer-events-auto fixed inset-0 z-50 bg-ink/55 p-3 sm:p-5" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSheet(false);
        }}>
          <div id="mobile-menu" ref={sheetRef} className="glass-panel relative mx-auto flex h-full max-w-[520px] flex-col overflow-hidden rounded-[24px]" role="dialog" aria-modal="true" aria-label={t.common.menu}>
            <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-rule px-5">
              <Logo />
              <button ref={closeButtonRef} type="button" onClick={() => setSheet(false)} className="grid size-11 place-items-center rounded-full text-navy hover:bg-navy/10" aria-label={t.common.close}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className="min-h-0 flex-1 overflow-y-auto px-5 py-4" aria-label={t.nav.label}>
              {[{ href: "#solutions", label: t.nav.solutions }, ...links].map((link) => (
                <a key={link.href} href={link.href} onClick={() => setSheet(false)} className="flex items-center justify-between border-b border-rule py-4 font-display text-[clamp(23px,6vw,30px)] tracking-[-0.03em] text-ink hover:text-navy">
                  {link.label}
                  <span className="text-lg text-primary" aria-hidden>↗</span>
                </a>
              ))}
              <div className="flex gap-2 pt-6">
                {locales.map((language) => (
                  <Link
                    key={language}
                    href={localePath(language)}
                    hrefLang={language}
                    scroll={false}
                    onClick={() => {
                      setSheet(false);
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${language === locale ? "bg-navy text-white" : "bg-navy/5 text-navy"}`}
                    aria-current={language === locale ? "page" : undefined}
                  >
                    {t.common.langName[language]}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="shrink-0 border-t border-rule px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
              <a href={contacts.salesHref} className="num mb-3 block text-[18px] font-semibold text-navy">{contacts.sales}</a>
              <div className="flex gap-2">
                <a href="#contact" onClick={() => setSheet(false)} className="nav-request flex-1 justify-center text-center">{t.common.request}</a>
                <a href={contacts.login} target="_blank" rel="noreferrer" className="rounded-full border border-navy/25 px-4 py-3 text-center text-sm font-semibold text-navy">{t.common.login}</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
