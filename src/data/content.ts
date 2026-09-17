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

const UPLOADS = "https://uzgps.uz/storage/app/uploads/public";

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

/** Логотипы из блока «Нам доверяют» на uzgps.uz; файлы маленькие, поэтому w/h — их родной размер. */
export const clients: ClientItem[] = [
  { id: "c-cbu", name: "Центральный банк Республики Узбекистан", short: "Центральный банк РУз", logo: `${UPLOADS}/5e7/71d/4f3/5e771d4f330ed278085412.png`, w: 78, h: 78 },
  { id: "c-ung", name: "АО «Узбекнефтегаз»", short: "Узбекнефтегаз", logo: `${UPLOADS}/5e7/71d/a4e/5e771da4eebb1033651275.png`, w: 90, h: 80 },
  { id: "c-uty", name: "АО «O‘zbekiston Temir Yo‘llari»", short: "O‘zbekiston Temir Yo‘llari", logo: `${UPLOADS}/5e7/71e/ad5/5e771ead5fd51348879917.png`, w: 65, h: 89 },
  { id: "c-guvd", name: "Главное управление внутренних дел", short: "ГУВД г. Ташкента", logo: `${UPLOADS}/5e7/71d/cea/5e771dcea01ac984181953.png`, w: 134, h: 75 },
  { id: "c-uzex", name: "АО «Узбекская республиканская товарно-сырьевая биржа»", short: "УзРТСБ (UZEX)", logo: `${UPLOADS}/5e7/71f/339/5e771f339a37c058535276.png`, w: 78, h: 78 },
  { id: "c-uzagro", name: "АО «Узагросервис»", short: "УзАгроСервис", logo: `${UPLOADS}/5ef/ca6/4c9/5efca64c9988e051967399.png`, w: 90, h: 80 },
  { id: "c-tshtx", name: "АК «Toshshahartransxizmat»", short: "Ташшахартрансхизмат", logo: `${UPLOADS}/5e7/71e/0a7/5e771e0a7f2a7312241892.png`, w: 86, h: 82 },
  { id: "c-safia", name: "Кондитерский дом «Safia»", short: "Safia", logo: `${UPLOADS}/5e7/71f/831/5e771f831d009749699259.png`, w: 64, h: 64 },
  { id: "c-zenta", name: "Zenta Pharm", short: "Zenta Pharm", logo: `${UPLOADS}/5e7/71f/16a/5e771f16aeeeb660236073.png`, w: 164, h: 48 },
  { id: "c-eurasia", name: "Eurasia Logistics Service", short: "Eurasia Logistics", logo: `${UPLOADS}/5e7/721/8c4/5e77218c481c3326017965.png`, w: 179, h: 48 },
  { id: "c-garant", name: "Garant Mebel", short: "Garant Mebel", logo: `${UPLOADS}/5e7/720/da1/5e7720da1edfe120011997.png`, w: 179, h: 43 },
  { id: "c-tml", name: "TML Logistics", short: "TML", logo: `${UPLOADS}/5e7/71f/5ab/5e771f5abfcbd370606632.png`, w: 124, h: 65 },
  { id: "c-oriat", name: "Радиостанция «Oriat FM»", short: "Oriat FM", logo: `${UPLOADS}/5e7/71e/f48/5e771ef48f077556170830.png`, w: 80, h: 75 },
  { id: "c-yellow", name: "Yellow Pages Uzbekistan", short: "Yellow Pages", logo: `${UPLOADS}/5e7/71e/827/5e771e82728f1658969707.png`, w: 158, h: 48 },
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
