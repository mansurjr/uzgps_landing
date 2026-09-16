import { ru, type Dict } from "./ru";
import { uz } from "./uz";

export const locales = ["ru", "uz"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

const dicts: Record<Locale, Dict> = { ru, uz };

export const getDict = (locale: Locale): Dict => dicts[locale] ?? dicts[defaultLocale];
export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

export type { Dict };

/** Подстановка значений в строку словаря: fill(t.contact.thanks, { name: "Алишер" }) */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}
