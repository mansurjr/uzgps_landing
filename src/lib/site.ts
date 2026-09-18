import { contacts } from "@/data/content";
import { type Locale } from "@/i18n";

/** Canonical origin. Override per environment with NEXT_PUBLIC_SITE_URL (no trailing slash). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://uzgps.uz").replace(/\/$/, "");

/** Both locales live at explicit routes "/ru" and "/uz". */
export const localePath = (locale: Locale) => `/${locale}`;
export const localeUrl = (locale: Locale) => `${SITE_URL}/${locale}`;

export const SITE = {
  url: SITE_URL,
  name: "UZGPS",
  legalName: "UZGPS — спутниковый мониторинг транспорта и персонала",
  locale: "ru_RU",
  founded: "2014",
  geo: { lat: 41.275578, lng: 69.220057 },
  address: {
    street: "ул. Кирк-Киз, 10",
    city: "Ташкент",
    postalCode: "100115",
    country: "UZ",
  },
  sameAs: [contacts.telegram, contacts.facebook, contacts.playStore, contacts.appStore, "https://uzgps.uz"],
};
