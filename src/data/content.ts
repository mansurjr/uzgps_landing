/** Данные без перевода: контакты, ссылки, логотипы и изображения. Тексты живут в src/i18n. */

export const contacts = {
  sales: "+998 (71) 207-44-44",
  salesHref: "tel:+998712074444",
  support: "(71) 230-55-44, (93) 183-55-44",
  telegram: "https://t.me/uzgps",
  facebook: "https://www.facebook.com/uzgps/",
  email: "info@uzgps.uz",
  address: "100115, Ташкент, ул. Кирк Киз, 10",
  landmark: "Ориентир: стадион «Миллий», мечеть «Козиробод»",
  login: "https://smpo.uzgps.uz/",
  playStore: "https://play.google.com/store/apps/details?id=com.uzgps.uzgps_viewer",
  appStore: "https://apps.apple.com/uz/app/uzgps-app/id6739448332",
  privacy: "https://uzgps.uz/mobileprivacy",
};


export type ClientItem = {
  id: string;
  /** название организации — имя собственное, не переводится */
  name: string;
  short: string;
  logo: string;
  w: number;
  h: number;
};

/** Республиканская служба 103 — выделенный клиент UZGPS. */
export const featuredClient: ClientItem = {
  id: "c103",
  name: "Республиканский центр экстренной медицинской помощи",
  short: "103",
  logo: "https://uz103.uz/img/new-logo-2.jpg",
  w: 96,
  h: 96,
};

/** Логотипы — официальные файлы организаций или Wikimedia Commons, хранятся локально в public/clients (источники в SOURCES.md). */
export const clients: ClientItem[] = [
  { id: "c-hududgaz", name: "АО «Худудгазтаъминот»", short: "Худудгазтаъминот", logo: "/clients/hududgaz.webp", w: 567, h: 107 },
  { id: "c-ung", name: "АО «Узбекнефтегаз»", short: "Узбекнефтегаз", logo: "/clients/uzbekneftegaz.svg", w: 1087, h: 218 },
  { id: "c-uztelecom", name: "АК «Узбектелеком»", short: "Узбектелеком", logo: "/clients/uztelecom.svg", w: 810, h: 120 },
  { id: "c-karantin", name: "Агентство карантина и защиты растений", short: "УзКарантин", logo: "/clients/karantin.webp", w: 538, h: 600 },
  { id: "c-iiv", name: "Министерство внутренних дел Республики Узбекистан", short: "МВД (ИИВ)", logo: "/clients/iiv.webp", w: 600, h: 600 },
  { id: "c-safe-city", name: "Центр развития систем «Безопасный город» МВД", short: "Безопасный город", logo: "/clients/iiv.webp", w: 600, h: 600 },
  { id: "c-national-guard", name: "Национальная гвардия Республики Узбекистан", short: "Национальная гвардия", logo: "/clients/national-guard.webp", w: 600, h: 600 },
  { id: "c-security", name: "Служба охраны Национальной гвардии", short: "Служба охраны", logo: "/clients/security.webp", w: 598, h: 600 },
  { id: "c-guard-troops", name: "Караульные войска МВД Республики Узбекистан", short: "Караульные войска", logo: "/clients/iiv.webp", w: 600, h: 600 },
  { id: "c-mchs", name: "Министерство по чрезвычайным ситуациям Республики Узбекистан", short: "МЧС", logo: "/clients/mchs.webp", w: 155, h: 156 },
  { id: "c-cabinet", name: "Кабинет Министров Республики Узбекистан", short: "Кабинет Министров", logo: "/clients/cabinet.svg", w: 678, h: 714 },
  { id: "c-lukoil", name: "ПАО «ЛУКОЙЛ»", short: "ЛУКОЙЛ", logo: "/clients/lukoil.svg", w: 709, h: 708 },
  { id: "c-railways", name: "АО «O‘zbekiston temir yo‘llari»", short: "Узбекистон темир йуллари", logo: "/clients/railways.webp", w: 462, h: 600 },
  { id: "c-airways", name: "АО «Uzbekistan Airways»", short: "Узбекистон хаво йуллари", logo: "/clients/uzairways.svg", w: 2506, h: 512 },
  { id: "c-agroleasing", name: "АО «Узагролизинг»", short: "Агролизинг", logo: "/clients/agrolizing.webp", w: 200, h: 32 },
];

/** Изображения устройств хранятся локально; источники указаны в public/devices/SOURCES.md. */
export const devices = [
  { model: "FMB920", image: "/devices/fmb920.webp" },
  { model: "FMC920", image: "/devices/fmc920.webp" },
  { model: "FMB930", image: "/devices/fmb930.webp" },
  { model: "FMB125", image: "/devices/fmb125.webp" },
  { model: "FMC125", image: "/devices/fmc125.webp" },
  { model: "EYE Sensor", image: "/devices/eye-sensor.webp" },
  { model: "EYE Beacon", image: "/devices/eye-beacon.webp" },
  { model: "Technoton DUT-E", image: "/devices/dut-e.webp" },
  { model: "Escort TD-BLE", image: "/devices/escort-td-ble.webp" },
  { model: "Omnicomm LLS 4", image: "/devices/omnicomm-lls4.webp" },
  { model: "Реле блокировки", image: "/devices/engine-relay.webp" },
  { model: "Замки Jointech", image: "/devices/jointech-jt701-jt709.jpg" },
  { model: "FMB140", image: "/devices/fmb140.webp" },
  { model: "FMC130", image: "/devices/fmc130.webp" },
  { model: "FMB003", image: "/devices/fmb003.webp" },
  { model: "FMM920", image: "/devices/fmm920.webp" },
] as const;

export type DeviceModel = (typeof devices)[number]["model"];

/** Скриншоты мобильного приложения UzGPS со страницы Google Play. */
export const appScreens = [
  "https://play-lh.googleusercontent.com/JHHrQtPGXp1nDXECbgvOTlpmtTv0JIDAfMbU996DJ5H0kZS9OO7RfDpm_jXF59-QRJK7UGLZQQ2EoeP8U_5l-w=w720",
  "https://play-lh.googleusercontent.com/QepjePNwNJfQjF1inlBioLKzvyfQxbl2UhjJDaRToAE50c2cqZsWFvSxJ1KrMc7HyvehIuYvoQXorByQ-YfXTUo=w720",
  "https://play-lh.googleusercontent.com/7essYSJeXjazeY50ykNJwUu8byuQ7ixl-d5QqopiXdzidWE_slRW_V8hxjLH_U_DNxcvMxuhDe2ODWoPkGRs=w720",
  "https://play-lh.googleusercontent.com/o7mLOiMwD4azzsNQl_ASYpqmyqGMq8-XvQpq5eWnhdxs4K7OtRE-QQGr1IPkTG6wwoC3XQYd0S9ZnzlcPVFFlFc=w720",
];

/** Марки датчиков уровня топлива с сайта uzgps.uz — имена собственные. */
export const fuelSensors = ["OMNICOMM LLS 4", "MIELTA ZOND", "ЭСКОРТ TD-BLE", "TECHNOTON DUT-E"];
