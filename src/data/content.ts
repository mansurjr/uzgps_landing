export const contacts = {
  sales: "+998 (71) 207-44-44",
  salesHref: "tel:+998712074444",
  support: "(71) 230-55-44, (93) 183-55-44",
  telegram: "https://t.me/uzgps",
  facebook: "https://www.facebook.com/uzgps/",
  email: "info@uzgps.uz",
  address: "100115, Ташкент, ул. Кирк Киз, 10",
  landmark: "Ориентир: стадион «Миллий», мечеть «Козиробод»",
  playStore: "https://play.google.com/store/apps/details?id=com.uzgps.uzgps_viewer",
  appStore: "https://apps.apple.com/uz/app/uzgps-app/id6739448332",
};

export const problems = [
  {
    q: "Подозреваете использование корпоративного транспорта в личных целях?",
    a: "Онлайн-контроль передвижения транспорта: местоположение, маршрут и статус каждого объекта в реальном времени.",
  },
  {
    q: "Слишком большой расход топлива?",
    a: "Полный учёт поездок, заправок и сливов по датчикам уровня топлива.",
  },
  {
    q: "Сотрудники не выполняют поручения в полном объёме, а клиенты недовольны сроками поставок?",
    a: "Мониторинг посещения запланированных мест: точки интереса, геозоны и события въезда-выезда.",
  },
  {
    q: "Не успеваете оплачивать штрафы сотрудников?",
    a: "Профилактика нарушений: лимиты скорости, резкие разгоны, торможения и повороты, оценка качества вождения.",
  },
  {
    q: "Вам необходима информация в любом месте и в любое время?",
    a: "Доступ к системе из браузера и мобильного приложения для Android и iOS.",
  },
];

export const industries = [
  {
    title: "Корпоративный транспорт",
    text: "Служебные машины под контролем: маршруты, пробег, простои и расход топлива по каждому объекту.",
  },
  {
    title: "Грузоперевозки и логистика",
    text: "Контроль доставки, соблюдение маршрутов и сроков, учёт топлива на магистральных рейсах.",
  },
  {
    title: "Пассажирский транспорт",
    text: "Соблюдение расписания и маршрутов, контроль скоростного режима на линии.",
  },
  {
    title: "Агропромышленный комплекс",
    text: "Техника в поле: моточасы, топливо и работа по геозонам во время посевной и уборочной.",
  },
  {
    title: "Железнодорожный транспорт",
    text: "Мониторинг подвижного состава и путевой техники на протяжённых участках.",
  },
  {
    title: "Экстренные и коммунальные службы",
    text: "Диспетчеризация выездных бригад: ближайшая свободная машина и контроль времени прибытия.",
  },
  {
    title: "Дистрибуция и ритейл",
    text: "Планы посещений торговых точек, отклонения от маршрута и фактическое время визита.",
  },
  {
    title: "Провайдерам телематических услуг",
    text: "СМПО UZGPS на вашем сервере: от сотен до нескольких тысяч объектов и полная техническая поддержка.",
  },
];

export const reasons = [
  "Доступ к системе из любой точки мира 24/7/365",
  "Подключение в сжатые сроки",
  "Удобный интерфейс на узбекском, русском и английском языках",
  "Полная техническая поддержка",
  "Высококвалифицированные специалисты",
  "Лицензии и сертификаты",
  "Отраслевые решения с индивидуальным подходом",
  "Быстрое реагирование на заявки",
  "Работа с оборудованием разных производителей",
];

export const timeline = [
  { year: "2014", title: "Создание компании", text: "Центр программистов BePro и АК «Узбектелеком» создают UZGPS в рамках развития Национальной информационной системы." },
  { year: "2015", title: "Развитие проекта", text: "Развитие собственной платформы мониторинга СМПО UZGPS." },
  { year: "2016", title: "Старт активных продаж", text: "Подключение первых корпоративных клиентов." },
  { year: "2017", title: "Расширение функционала", text: "Контроль топлива, система отчётов и уведомлений." },
  { year: "2018–19", title: "Отраслевые решения", text: "Решения для агро, железнодорожного транспорта, экстренных служб и провайдеров." },
];

const UPLOADS = "https://uzgps.uz/storage/app/uploads/public";

export type ClientItem = {
  id: string;
  name: string;
  short: string;
  logo: string;
  w: number;
  h: number;
  industry: string;
  text: string;
  stats?: string;
  href?: string;
};

/** Featured client: UZGPS runs the monitoring system of the national 103 ambulance service (103smpo.uzgps.uz). */
export const featuredClient: ClientItem = {
  id: "c103",
  name: "Республиканский центр экстренной медицинской помощи",
  short: "Служба 103",
  text: "Машины республиканской службы скорой помощи работают в отдельной системе СМПО UZGPS — 103smpo.uzgps.uz.",
  logo: "https://uz103.uz/img/new-logo-2.jpg",
  w: 96,
  h: 96,
  industry: "Экстренные службы",
  href: "https://uz103.uz/ru",
};

// logos as published in the «Нам доверяют» block of uzgps.uz with detailed descriptions
export const clients: ClientItem[] = [
  {
    id: "c-cbu",
    name: "Центральный банк Республики Узбекистан",
    short: "Центральный банк РУз",
    logo: `${UPLOADS}/5e7/71d/4f3/5e771d4f330ed278085412.png`,
    w: 78,
    h: 78,
    industry: "Государственный сектор",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
  {
    id: "c-ung",
    name: "АО «Узбекнефтегаз»",
    short: "Узбекнефтегаз",
    logo: `${UPLOADS}/5e7/71d/a4e/5e771da4eebb1033651275.png`,
    w: 90,
    h: 80,
    industry: "Нефтегазовая отрасль",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
  {
    id: "c-uty",
    name: "АО «O‘zbekiston Temir Yo‘llari»",
    short: "O‘zbekiston Temir Yo‘llari",
    logo: `${UPLOADS}/5e7/71e/ad5/5e771ead5fd51348879917.png`,
    w: 65,
    h: 89,
    industry: "Железнодорожный транспорт",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
  {
    id: "c-guvd",
    name: "Главное управление внутренних дел",
    short: "ГУВД г. Ташкента",
    logo: `${UPLOADS}/5e7/71d/cea/5e771dcea01ac984181953.png`,
    w: 134,
    h: 75,
    industry: "Правоохранительные органы",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
  {
    id: "c-uzex",
    name: "АО «Узбекская республиканская товарно-сырьевая биржа»",
    short: "УзРТСБ (UZEX)",
    logo: `${UPLOADS}/5e7/71f/339/5e771f339a37c058535276.png`,
    w: 78,
    h: 78,
    industry: "Финансовый сектор",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
  {
    id: "c-uzagro",
    name: "АО «Узагросервис»",
    short: "УзАгроСервис",
    logo: `${UPLOADS}/5ef/ca6/4c9/5efca64c9988e051967399.png`,
    w: 90,
    h: 80,
    industry: "Сельское хозяйство",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
  {
    id: "c-tshtx",
    name: "АК «Toshshahartransxizmat»",
    short: "Ташшахартрансхизмат",
    logo: `${UPLOADS}/5e7/71e/0a7/5e771e0a7f2a7312241892.png`,
    w: 86,
    h: 82,
    industry: "Пассажирский транспорт",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
  {
    id: "c-safia",
    name: "Кондитерский дом «Safia»",
    short: "Safia Bakery",
    logo: `${UPLOADS}/5e7/71f/831/5e771f831d009749699259.png`,
    w: 64,
    h: 64,
    industry: "Пищевая промышленность",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
  {
    id: "c-zenta",
    name: "Zenta Pharm",
    short: "Zenta Pharm",
    logo: `${UPLOADS}/5e7/71f/16a/5e771f16aeeeb660236073.png`,
    w: 164,
    h: 48,
    industry: "Фармацевтика",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
  {
    id: "c-eurasia",
    name: "Eurasia Logistics Service",
    short: "Eurasia Logistics",
    logo: `${UPLOADS}/5e7/721/8c4/5e77218c481c3326017965.png`,
    w: 179,
    h: 48,
    industry: "Международная логистика",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
  {
    id: "c-garant",
    name: "Garant Mebel",
    short: "Garant Mebel",
    logo: `${UPLOADS}/5e7/720/da1/5e7720da1edfe120011997.png`,
    w: 179,
    h: 43,
    industry: "Производство и ритейл",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
  {
    id: "c-tml",
    name: "TML Logistics",
    short: "TML",
    logo: `${UPLOADS}/5e7/71f/5ab/5e771f5abfcbd370606632.png`,
    w: 124,
    h: 65,
    industry: "Грузоперевозки",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
  {
    id: "c-oriat",
    name: "Радиостанция «Oriat FM»",
    short: "Oriat FM",
    logo: `${UPLOADS}/5e7/71e/f48/5e771ef48f077556170830.png`,
    w: 80,
    h: 75,
    industry: "Медиа и корпорации",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
  {
    id: "c-yellow",
    name: "Yellow Pages Uzbekistan",
    short: "Yellow Pages",
    logo: `${UPLOADS}/5e7/71e/827/5e771e82728f1658969707.png`,
    w: 158,
    h: 48,
    industry: "Информационные сервисы",
    text: "Использует систему спутникового мониторинга UZGPS.",
  },
];

// one rendition per device, reused by the slide and its thumbnail so the browser fetches it once;
// 720px wide is enough for the largest card and keeps the source file small
const wix = (id: string, name: string) =>
  `https://static.wixstatic.com/media/${id}~mv2.png/v1/fill/w_720,h_480,al_c,q_85,enc_auto/${name}.png`;

export type DeviceItem = {
  model: string;
  title: string;
  text: string;
  image: string;
  specs: string[];
  badge?: string;
};

// official Teltonika product renders with technical badges
export const devices: DeviceItem[] = [
  {
    model: "FMB920",
    title: "Компактный трекер",
    text: "Самая популярная модель для легковых машин и защиты от угона. Скрытая установка, встроенные антенны.",
    image: wix("83e479_be44ae027426433a84ac2a5f80461bc5", "FMB920"),
    specs: ["GNSS / GSM", "Bluetooth 4.0", "Micro-SIM", "Встроенный акселометр"],
    badge: "Хит продаж",
  },
  {
    model: "FMB125",
    title: "Трекер с RS232 / RS485",
    text: "Подключение датчиков уровня топлива (ДУТ) и внешнего оборудования. Для грузовиков и спецтехники.",
    image: wix("83e479_949f0a0ab8c2440eae3be60e91b3195f", "FMB125"),
    specs: ["RS232 / RS485", "Датчики топлива", "Dual SIM", "Bluetooth LE"],
    badge: "Для ДУТ",
  },
  {
    model: "FMB140",
    title: "Чтение CAN-шины",
    text: "Данные с бортового компьютера: реальный расход, обороты, пробег по одометру.",
    image: wix("83e479_a5412141602a4f189bbe1443873e1563", "FMB140"),
    specs: ["CAN-шина", "Чтение ошибок", "Dual SIM", "Bluetooth 4.0"],
    badge: "CAN Считыватель",
  },
  {
    model: "FMC130",
    title: "4G LTE трекер",
    text: "Связь нового поколения, цифровые и аналоговые входы для датчиков и управления.",
    image: wix("83e479_22b33b1a25304cccafd04584c7a3ff41", "FMC130"),
    specs: ["4G LTE Cat 1", "Аналоговые входы", "Impulse inputs", "Bluetooth 4.0"],
    badge: "4G Скорость",
  },
  {
    model: "FMB003",
    title: "OBD-трекер",
    text: "Устанавливается в разъём OBD за минуту, без монтажа проводки.",
    image: wix("83e479_7efad16ad1c54f8dbbe9377957b9dfc5", "FMB003"),
    specs: ["OBD-II Plug&Play", "Чтение OEM CAN", "Bluetooth 4.0", "Компактный корпус"],
    badge: "Plug & Play",
  },
  {
    model: "FMM920",
    title: "Компактный LTE Cat M1",
    text: "Малый размер и низкое энергопотребление для лёгкого транспорта.",
    image: wix("83e479_89d7037335ba460ba11e70063df43a61", "FMM920"),
    specs: ["LTE Cat M1 / NB-IoT", "Энергосбережение", "Bluetooth 4.0", "Компактный размер"],
    badge: "Энергоэффективный",
  },
];

// UzGPS mobile app screenshots from its Google Play listing
export const appScreens = [
  "https://play-lh.googleusercontent.com/JHHrQtPGXp1nDXECbgvOTlpmtTv0JIDAfMbU996DJ5H0kZS9OO7RfDpm_jXF59-QRJK7UGLZQQ2EoeP8U_5l-w=w720",
  "https://play-lh.googleusercontent.com/QepjePNwNJfQjF1inlBioLKzvyfQxbl2UhjJDaRToAE50c2cqZsWFvSxJ1KrMc7HyvehIuYvoQXorByQ-YfXTUo=w720",
  "https://play-lh.googleusercontent.com/7essYSJeXjazeY50ykNJwUu8byuQ7ixl-d5QqopiXdzidWE_slRW_V8hxjLH_U_DNxcvMxuhDe2ODWoPkGRs=w720",
  "https://play-lh.googleusercontent.com/o7mLOiMwD4azzsNQl_ASYpqmyqGMq8-XvQpq5eWnhdxs4K7OtRE-QQGr1IPkTG6wwoC3XQYd0S9ZnzlcPVFFlFc=w720",
];

/** Разделы веб-платформы СМПО (smn-web: src/domains/smn) */
export const systemModules = [
  { title: "Мониторинг", text: "Список объектов с фильтрами по статусу, зажиганию, спутникам и топливу, карточка объекта и выгрузка в Excel." },
  { title: "Трекинг", text: "Трек за период с плеером и графиком: скорость, зажигание, показания ДУТ, заправки и сливы." },
  { title: "Точки интереса (PoI)", text: "Собственные точки на карте с именами и значками для контроля посещений." },
  { title: "Геозоны (ZoI)", text: "Зоны интереса: круг, полигон и линия, площадь в гектарах, события въезда и выезда." },
  { title: "Сообщения", text: "Сообщения от объектов и история обмена с оборудованием." },
  { title: "Отчёты", text: "Аналитические панели: пробег, моточасы, простои, нарушения и расход топлива." },
  { title: "Настройки объектов", text: "Значок, параметры трека, лимиты скорости и интервалов связи, параметры эко-вождения." },
  { title: "Мобильное приложение", text: "UzGPS для Android и iOS: объекты на карте, треки и отчёты в телефоне." },
];

/** Подложки карты, доступные в системе (useBaseLayers) */
export const mapLayers = ["OSM", "Google Streets", "Google Hybrid", "Яндекс", "Яндекс Hybrid"];

/** Статусы объекта в мониторинге (iconOptionsStatus) */
export const objectStatuses = ["В движении", "Остановка", "Стоянка", "Потеря связи", "Долгая потеря связи", "Нет данных"];

/** Оборудование со страницы «Оборудование» uzgps.uz */
export const equipmentKit = [
  {
    t: "GPS-трекеры",
    d: "Компактный прибор с GPS-приёмником и GSM-модемом: определяет координаты и скорость и передаёт данные на сервер по GPRS. Автомобильные и персональные модели.",
  },
  {
    t: "Датчики уровня топлива",
    d: "ДУТ измеряет наполнение и расход топлива в баке. Устанавливается на транспорт с объёмом бака более 50 литров: грузовые машины, спецтехника, автобусы.",
  },
  {
    t: "Дополнительное оборудование",
    d: "Идентификация водителя (iButton), CAN-адаптеры, датчик нагрузки на ось, датчик наличия пассажира, защитный бокс на трекер, диспетчерская связь.",
  },
];

/** Марки датчиков уровня топлива с сайта uzgps.uz */
export const fuelSensors = ["OMNICOMM LLS", "MIELTA ZOND", "ЭСКОРТ ТД-150", "TECHNOTON DUT-E"];
