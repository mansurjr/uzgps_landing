"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger, svg } from "animejs";
import { contacts } from "@/data/content";
import { fill } from "@/i18n";
import { useDict } from "@/i18n/DictProvider";
import { useReveal } from "@/lib/useReveal";
import TablerIcon, { type TablerName } from "./smpo/TablerIcon";

type Status = "idle" | "sending" | "done" | "error";

// ул. Кирк-Киз, 10 (OSM way 462400704)
const OFFICE = { lat: 41.275578, lng: 69.220057 };
const YANDEX_EMBED = `https://yandex.uz/map-widget/v1/?ll=${OFFICE.lng}%2C${OFFICE.lat}&z=17&pt=${OFFICE.lng}%2C${OFFICE.lat}%2Cpm2blm&lang=ru_RU`;
const YANDEX_LINK = `https://yandex.uz/maps/?pt=${OFFICE.lng},${OFFICE.lat}&z=17&l=map`;

const channels: { icon: TablerName; key: "salesDept" | "support" | "email" | "telegram"; value: string; href: string }[] = [
  { icon: "phone", key: "salesDept", value: contacts.sales, href: contacts.salesHref },
  { icon: "headset", key: "support", value: contacts.support, href: "tel:+998712305544" },
  { icon: "mail", key: "email", value: contacts.email, href: `mailto:${contacts.email}` },
  { icon: "brand-telegram", key: "telegram", value: "t.me/uzgps", href: contacts.telegram },
];

/** +998 (90) 123-45-67 */
function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("998")) d = d.slice(3);
  d = d.slice(0, 9);
  const p = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)];
  let out = "+998";
  if (p[0]) out += ` (${p[0]}`;
  if (p[0].length === 2) out += ")";
  if (p[1]) out += ` ${p[1]}`;
  if (p[2]) out += `-${p[2]}`;
  if (p[3]) out += `-${p[3]}`;
  return out;
}
const phoneDigits = (v: string) => v.replace(/\D/g, "").replace(/^998/, "");

export default function Contact() {
  const { t } = useDict();
  const channelLabel = (key: string) => (key === "telegram" ? "Telegram" : t.common[key as "salesDept" | "support" | "email"]);
  const root = useRef<HTMLElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [comment, setComment] = useState("");
  const [touched, setTouched] = useState(false);
  useReveal(root, { step: 70 });

  const nameOk = name.trim().length >= 2;
  const phoneOk = phoneDigits(phone).length === 9;

  useEffect(() => {
    const el = doneRef.current;
    if (status !== "done" || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = animate(svg.createDrawable(el.querySelectorAll("[data-draw]")), { draw: ["0 0", "0 1"], duration: 900, delay: stagger(250), ease: "inOutQuart" });
    const b = animate(el.querySelectorAll("[data-done-text]"), { opacity: [0, 1], translateY: [12, 0], duration: 600, delay: stagger(80, { start: 500 }), ease: "outQuart" });
    return () => {
      a.pause();
      b.pause();
    };
  }, [status]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!nameOk || !phoneOk) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, company, interest: comment }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const reset = () => {
    setStatus("idle");
    setName("");
    setPhone("");
    setCompany("");
    setComment("");
    setTouched(false);
  };

  return (
    <section ref={root} id="contact" className="bg-milk py-24 lg:py-32">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 data-reveal className="h-section">{t.contact.title}</h2>
          <p data-reveal className="lead max-w-[500px] lg:justify-self-end">
            {t.contact.lead}
          </p>
        </div>

        <div data-reveal className="mt-14 grid overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-40px_rgba(10,26,48,.35)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* contacts + map */}
          <div className="flex flex-col bg-navy text-paper">
            <div className="p-7 md:p-10">
              <p className="text-[15px] text-paper/60">{t.contact.directly}</p>
              <ul className="mt-5 space-y-1">
                {channels.map((c) => (
                  <li key={c.key}>
                    <a
                      href={c.href}
                      target={c.href?.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-primary transition-colors group-hover:bg-primary group-hover:text-navy">
                        <TablerIcon name={c.icon} size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] text-paper/55">{channelLabel(c.key)}</span>
                        <span className="num block text-[17px] font-medium [overflow-wrap:anywhere]">{c.value}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mt-auto min-h-[280px] flex-1 bg-[#dfe6ee]">
              <iframe
                title={t.contact.mapTitle}
                src={YANDEX_EMBED}
                loading="lazy"
                className="absolute inset-0 size-full border-0"
                allowFullScreen
              />
              <a
                href={YANDEX_LINK}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-ink shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-medium">{contacts.address}</span>
                  <span className="block truncate text-[13px] text-graphite">{contacts.landmark.replace("Ориентир: ", "")}</span>
                </span>
                <span className="shrink-0 text-[13px] font-medium text-navy">{t.contact.route}</span>
              </a>
            </div>
          </div>

          {/* form */}
          <div className="flex flex-col justify-center p-7 md:p-8 lg:p-10">
            {status === "done" ? (
              <div ref={doneRef} className="flex min-h-[420px] flex-col items-start justify-center" aria-live="polite">
                <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden>
                  <circle data-draw cx="36" cy="36" r="33" fill="none" stroke="#00adec" strokeWidth="3" />
                  <path data-draw d="M22 37l9 9 19-20" fill="none" stroke="#043168" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 data-done-text className="mt-8 font-display text-[34px] leading-tight tracking-[-0.03em]">
                  {fill(t.contact.thanks, { name: name.trim().split(" ")[0] })}
                </h3>
                <p data-done-text className="mt-3 max-w-[420px] text-[17px] leading-relaxed text-graphite">
                  {t.contact.doneText} <span className="num whitespace-nowrap text-ink">{phone}</span>.
                </p>
                <button data-done-text type="button" onClick={reset} className="btn-ghost mt-10 text-navy">{t.contact.again}</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h3 className="font-display text-[clamp(26px,2.4vw,34px)] leading-tight tracking-[-0.03em]">{t.contact.formTitle}</h3>
                <p className="mt-2 text-[15px] text-graphite">{t.contact.formLead}</p>

                <div className="mt-8 grid gap-x-5 gap-y-2 sm:grid-cols-2 ">
                  <Field
                    label={t.contact.name}
                    required
                    value={name}
                    onChange={setName}
                    autoComplete="name"
                    error={touched && !nameOk ? t.contact.nameError : undefined}
                  />
                  <Field
                    label={t.contact.phone}
                    required
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    placeholder="+998 (__) ___-__-__"
                    onChange={(v) => setPhone(v.replace(/\D/g, "").replace(/^998/, "") ? formatPhone(v) : "")}
                    autoComplete="tel"
                    error={touched && !phoneOk ? t.contact.phoneError : undefined}
                  />
                  <Field className="sm:col-span-2" label={t.contact.company} value={company} onChange={setCompany} autoComplete="organization" />
                </div>

                <label className="mt-2 block">
                  <span className="text-[14px] font-medium">{t.contact.comment}</span>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, 200))}
                    rows={3}
                    placeholder={t.contact.commentPlaceholder}
                    className="mt-2 w-full resize-none rounded-xl border-2 border-transparent bg-paper px-4 py-3.5 text-[16px] outline-none transition-all placeholder:text-ink/30 focus:border-primary focus:bg-white"
                  />
                </label>

                <button disabled={status === "sending"} className="btn-primary mt-6 w-full rounded-xl disabled:opacity-60">
                  {status === "sending" ? t.contact.sending : t.contact.submit}
                </button>
                {status === "error" && (
                  <p role="alert" className="mt-4 rounded-xl bg-alert/10 px-4 py-3 text-[15px] text-alert">
                    {t.contact.sendError} {contacts.sales}
                  </p>
                )}
                <p className="mt-5 text-[13px] leading-relaxed text-graphite">
                  {t.contact.consent}{" "}
                  <a href={contacts.privacy} target="_blank" rel="noreferrer" className="text-navy underline underline-offset-2">{t.contact.policy}</a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  required,
  className = "",
  ...inputProps
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "className">) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[14px] font-medium">
        {label}
        {required && <span className="text-graphite"> *</span>}
      </span>
      <input
        {...inputProps}
        value={value}
        required={required}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full rounded-xl border-2 bg-paper px-4 py-3.5 text-[16px] outline-none transition-all placeholder:text-ink/30 focus:bg-white ${
          error ? "border-alert/60 focus:border-alert" : "border-transparent focus:border-primary"
        }`}
      />
      <span className={`mt-1.5 block min-h-[20px] text-[13px] text-alert transition-opacity ${error ? "opacity-100" : "opacity-0"}`} aria-live="polite">
        {error}
      </span>
    </label>
  );
}
