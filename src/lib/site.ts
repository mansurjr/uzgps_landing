import { contacts } from "@/data/content";

/** Canonical origin. Override per environment with NEXT_PUBLIC_SITE_URL (no trailing slash). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://uzgps.uz").replace(/\/$/, "");

export const SITE = {
  url: SITE_URL,
  name: "UZGPS",
  legalName: "UZGPS — спутниковый мониторинг транспорта и персонала",
  title: "UZGPS — спутниковый мониторинг транспорта и персонала в Узбекистане",
  description:
    "GPS-мониторинг транспорта и персонала: онлайн-контроль передвижения, контроль топлива по датчикам ДУТ, отчёты и геозоны. Облачное и серверное решение СМПО, оборудование Teltonika, установка и поддержка в Ташкенте.",
  shortDescription: "Спутниковый мониторинг транспорта и персонала в Узбекистане с 2014 года.",
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
