import type { Dict } from "./ru";

/** O‘zbekcha (lotin) tarjima. Tuzilmasi ru.ts bilan bir xil. */
export const uz: Dict = {
  locale: "uz",
  htmlLang: "uz",
  seo: {
    title: "UZGPS — O‘zbekistonda transport va xodimlar sun’iy yo‘ldosh monitoringi",
    description:
      "Transport va xodimlar GPS-monitoringi: harakatni onlayn kuzatish, YSD datchiklari orqali yoqilg‘i nazorati, hisobotlar va geozonalar. SMPO bulutli va server yechimi, Teltonika uskunalari, Toshkentda o‘rnatish va texnik yordam.",
    short: "O‘zbekistonda transport va xodimlar sun’iy yo‘ldosh monitoringi — 2014 yildan beri.",
    ogTitle: "Transport va xodimlar sun’iy yo‘ldosh monitoringi",
    ogSubtitle: "Harakatni onlayn kuzatish, yoqilg‘i nazorati, hisobotlar va geozonalar. O‘zbekiston, 2014 yildan beri.",
    keywords: [
      "GPS monitoring",
      "transport monitoringi",
      "sun’iy yo‘ldosh monitoringi",
      "yoqilg‘i nazorati",
      "yoqilg‘i sathi datchigi",
      "YSD",
      "GPS treker",
      "Teltonika",
      "xodimlar monitoringi",
      "SMPO",
      "UZGPS",
      "O‘zbekiston",
      "Toshkent",
    ],
  },

  common: {
    skipToContent: "Asosiy qismga o‘tish",
    menu: "Menyu",
    close: "Yopish",
    login: "Tizimga kirish",
    request: "Ariza qoldirish",
    consultation: "Konsultatsiya olish",
    demo: "Demo-kirish so‘rash",
    more: "Batafsil",
    salesDept: "Savdo bo‘limi",
    support: "Texnik yordam",
    address: "Manzil",
    email: "Elektron pochta",
    langName: { ru: "RU", uz: "UZ" },
    spec: "Xususiyat",
  },

  nav: {
    label: "Asosiy menyu",
    solutions: "Yechimlar",
    platform: "Platforma",
    equipment: "Uskunalar",
    savings: "Tejamkorlik",
    about: "Kompaniya haqida",
    megaIndustries: "Sohalar bo‘yicha",
    megaDeployment: "Joylashtirish",
    megaCloud: { title: "Bulutli yechim", text: "O‘z serveringizsiz. Brauzer va ilova orqali ishlash." },
    megaServer: { title: "Server yechimi", text: "SMPO sizning infratuzilmangizda yuzlab va minglab mashinalar uchun." },
    megaProvider: { title: "Telematika provayderlariga", text: "O‘z brendingiz ostidagi monitoring platformasi." },
    megaCta: { title: "O‘tgan oyda yoqilg‘ida qancha yo‘qotdingiz?", action: "Bir daqiqada hisoblash →" },
  },

  hero: {
    h1: "Avtoparkni taxminlarsiz nazorat qiling",
    lead: "Transport va xodimlar sun’iy yo‘ldosh monitoringi: mashina qayerda, yoqilg‘i qancha, kim marshrutni buzdi — onlayn, brauzerda va mobil ilovada.",
    ctaSecondary: "Tizimni ko‘rish",
    figures: [
      { label: "yil O‘zbekiston bozorida" },
      { label: "yoqilg‘i xarajatlarining kamayishi" },
      { label: "ta mashina bitta SMPO serverida" },
    ],
  },

  clients: {
    title: "Bizga ishonishadi",
    lead: "O‘zbekiston bo‘ylab vazirliklar, kuch va favqulodda xizmatlar, energetika, transport va aloqa. Batafsil ma’lumot uchun logotipni bosing.",
  },

  problems: {
    title: "Avtopark ishlayapti, xarajatlar esa o‘sayapti. Tanishmi?",
    lead: "Avtopark rahbarlari bizga eng ko‘p beradigan beshta savol va UZGPS platformasining yechimi.",
  },

  platform: {
    title: "Butun avtopark uchun yagona tizim",
    lead: "SMPO UZGPS — O‘zbekistonda ishlab chiqilgan o‘z platformamiz. Interfeys o‘zbek, rus va ingliz tillarida.",
    tabsLabel: "Platforma imkoniyatlari",
    modulesTitle: "Tizim tarkibi",
    statuses: "Obyekt holatlari",
    mobile: {
      title: "UzGPS mobil ilovasi",
      text: "Obyektlar xaritada, safar treklari va hisobotlar — rahbarning smartfonida. UZGPS mijozlari uchun bepul.",
      screenAlt: "UzGPS ilovasi ekrani",
    },
    videoTitle: "SMPO UZGPS ish jarayonida",
  },

  how: {
    title: "O‘rnatishdan birinchi hisobotgacha",
    step: "Bosqich",
    steps: [
      { t: "Uskunani o‘rnatish", d: "GPS-treker va yoqilg‘i datchiklarini o‘rnatamiz. Uskunaga kafolat — 12 oy." },
      { t: "Ma’lumot uzatish", d: "Koordinatalar, tezlik va yoqilg‘i sathi uyali tarmoq orqali har necha soniyada serverga yuboriladi." },
      { t: "Serverda qayta ishlash", d: "UZGPS buluti yoki o‘z serveringiz hodisalarni qayd etadi va butun tarixni saqlaydi." },
      { t: "Natija sizda", d: "Xarita, hisobotlar va bildirishnomalar brauzerda hamda mobil ilovada." },
    ],
  },

  calculator: {
    title: "Avtoparkingiz qancha yo‘qotayotganini hisoblang",
    lead: "Park parametrlarini kiriting — kalkulyator quyilmalar, shaxsiy safarlar va bo‘sh turishlar nazorati hisobiga qancha qaytarish mumkinligini ko‘rsatadi.",
    kindLegend: "Texnika turi",
    kinds: ["Yengil avtomobil", "Yuk mashinasi 10 t gacha", "Yuk mashinasi 10 t dan", "Maxsus texnika"],
    per100: "l/100 km",
    countLabel: "Mashinalar soni",
    kmLabel: "Bitta mashinaning kunlik o‘rtacha yurishi",
    priceLabel: "Yoqilg‘i narxi",
    units: { pcs: "dona", km: "km", sum: "so‘m", sumPerL: "so‘m/l", litres: "l" },
    resultTitle: "Bir yilda tejash mumkin",
    perMonth: "Oyiga",
    fuelPerMonth: "Oyiga yoqilg‘i",
    currentCost: "Hozirgi yoqilg‘i xarajati",
    perMonthSuffix: "so‘m/oy",
    cta: "Aniq hisob-kitob olish",
    note: "Hisob {days} ish kuni va yoqilg‘i xarajatining {share}% qaytishi bo‘yicha. UZGPS mijozlari 30% gacha qayd etadi.",
  },

  solutions: {
    title: "Sohangiz uchun yechimlar",
    lead: "2014 yildan beri monitoringni davlat sektori, sanoat, transport va logistikada joriy qilamiz. Modullar bir xil — sozlamalar sizning jarayonlaringizga moslanadi.",
    deployTitle: "Bulut yoki o‘z serveringiz",
    cloud: "Bulutli yechim",
    server: "Server yechimi",
    deploy: [
      {
        k: "Ma’lumotlar qayerda saqlanadi",
        cloud: "UZGPS serverlarida — qimmat uskuna sotib olmasdan",
        server: "Sizning serveringizda, tashkilot ichki tarmog‘ida",
      },
      { k: "Qachon mos keladi", cloud: "Har qanday park, tez ishga tushirish", server: "Xavfsizlik siyosati tashqi serverlarni taqiqlasa" },
      { k: "Ko‘lami", cloud: "Bitta mashinadan boshlab", server: "Yuzlab va minglab mashinalar" },
      {
        k: "Sizdan nima talab qilinadi",
        cloud: "Brauzer yoki mobil ilova",
        server: "Keng internet kanali, doimiy IP, kunu tun ishlaydigan server va administratorlik",
      },
    ],
  },

  equipment: {
    title: "Uskunalar, o‘rnatish va texnik xizmat",
    lead: "To‘liq tsikl — uskunani tanlash va o‘rnatishdan texnik xizmat ko‘rsatishgacha. Uskunaga kafolat 12 oy.",
    sensors: "Yoqilg‘i sathi datchiklari:",
    carousel: {
      title: "Trekerlar va uskunalar",
      lead: "Transport monitoringi uchun trekerlar, yonilg‘i datchiklari va aksessuarlar. Parkingizga mos to‘plamni tanlaymiz.",
      prev: "Oldingi uskuna",
      next: "Keyingi uskuna",
      tablist: "Uskuna modellari",
      slideOf: "{n} tadan {i}: {model}",
      cta: "Uskuna tanlash",
    },
  },

  about: {
    title: "Milliy sun’iy yo‘ldosh monitoringi tizimi",
    text1:
      "UZGPS Toshkentdagi BePro dasturchilar markazi tomonidan «O‘zbektelekom» AK bilan birgalikda Milliy axborot tizimini rivojlantirish doirasida ishlab chiqilgan.",
    text2:
      "Maqsadimiz — O‘zbekistonda sun’iy yo‘ldosh monitoringi, dispetcherlik va navigatsiya texnologiyalarini to‘liq import o‘rnini bosish.",
    reasonsTitle: "Nega UZGPS ni tanlashadi",
    reasonsLead:
      "O‘zbekistonda ishlab chiqilgan o‘z platformasi, texnik yordam va mijoz vazifalariga moslashtirilgan sohaviy yechimlar.",
  },

  contact: {
    title: "UZGPS bilan doimo to‘g‘ri yo‘lda",
    lead: "Kontaktlaringizni qoldiring — mutaxassis qo‘ng‘iroq qiladi, uskuna tanlaydi va narxini hisoblab beradi. Konsultatsiya bepul.",
    directly: "Yoki to‘g‘ridan-to‘g‘ri bog‘laning",
    mapTitle: "UZGPS ofisi Yandex Xaritalarida",
    route: "Yo‘nalish →",
    formTitle: "Konsultatsiya uchun ariza",
    formLead: "Ish vaqtida qo‘ng‘iroq qilamiz.",
    name: "Ismingiz",
    phone: "Telefon",
    company: "Kompaniya",
    comment: "Izoh",
    commentPlaceholder: "Masalan: 20 ta yuk mashinasi, yoqilg‘i nazorati kerak",
    submit: "Arizani yuborish",
    sending: "Yuborilmoqda…",
    nameError: "Ismingizni kiriting",
    phoneError: "+998 dan keyin 9 ta raqam",
    sendError: "Arizani yuborib bo‘lmadi. Bizga qo‘ng‘iroq qiling:",
    thanks: "Rahmat, {name}!",
    doneText: "Ariza qabul qilindi. UZGPS mutaxassisi shu raqamga qo‘ng‘iroq qiladi:",
    again: "Yana bitta ariza yuborish",
    consent: "«Arizani yuborish» tugmasini bosish orqali siz",
    policy: "maxfiylik siyosatiga rozilik bildirasiz",
  },

  footer: {
    about: "Transport va xodimlar sun’iy yo‘ldosh monitoringi. UZGPS ishlab chiquvchisi — Toshkentdagi BePro dasturchilar markazi.",
    solutions: "Yechimlar",
    company: "Kompaniya",
    contacts: "Kontaktlar",
    calculator: "Tejamkorlik kalkulyatori",
    rights: "Barcha huquqlar himoyalangan.",
  },

  content: {
    problems: [
      {
        q: "Korporativ transportdan shaxsiy maqsadlarda foydalanilayotganidan shubhalanasizmi?",
        a: "Transport harakatini onlayn nazorat qilish: har bir obyektning joylashuvi, marshruti va holati real vaqtda.",
      },
      { q: "Yoqilg‘i sarfi juda kattami?", a: "Safarlar, quyishlar va quyib olishlarning yoqilg‘i sathi datchiklari bo‘yicha to‘liq hisobi." },
      {
        q: "Xodimlar topshiriqlarni to‘liq bajarmayapti, mijozlar esa yetkazib berish muddatidan norozimi?",
        a: "Rejalashtirilgan joylarga tashrifni kuzatish: qiziqish nuqtalari, geozonalar va kirish-chiqish hodisalari.",
      },
      {
        q: "Xodimlarning jarimalarini to‘lashga ulgurmayapsizmi?",
        a: "Qoidabuzarliklar profilaktikasi: tezlik chegaralari, keskin tezlanish, tormozlash va burilishlar, haydash sifati bahosi.",
      },
      {
        q: "Ma’lumot sizga istalgan joyda va istalgan vaqtda kerakmi?",
        a: "Tizimga brauzerdan hamda Android va iOS mobil ilovasidan kirish.",
      },
    ],

    industries: [
      { title: "Korporativ transport", text: "Xizmat mashinalari nazoratda: har bir obyekt bo‘yicha marshrut, yurish, bo‘sh turish va yoqilg‘i sarfi." },
      { title: "Yuk tashish va logistika", text: "Yetkazib berish nazorati, marshrut va muddatlarga rioya, magistral reyslarda yoqilg‘i hisobi." },
      { title: "Yo‘lovchi transporti", text: "Jadval va marshrutlarga rioya qilish, liniyada tezlik rejimi nazorati." },
      { title: "Agrosanoat majmuasi", text: "Dalada texnika: motosoatlar, yoqilg‘i va ekish hamda hosil yig‘ish davrida geozonalar bo‘yicha ish." },
      { title: "Temir yo‘l transporti", text: "Harakat tarkibi va yo‘l texnikasini uzun uchastkalarda kuzatish." },
      { title: "Favqulodda va kommunal xizmatlar", text: "Chiquvchi brigadalar dispetcherligi: eng yaqin bo‘sh mashina va yetib borish vaqti nazorati." },
      { title: "Distribyutsiya va riteyl", text: "Savdo nuqtalariga tashrif rejalari, marshrutdan chetlanishlar va tashrifning haqiqiy vaqti." },
      { title: "Telematika provayderlariga", text: "SMPO UZGPS sizning serveringizda: yuzlab obyektdan bir necha minggacha va to‘liq texnik yordam." },
    ],

    reasons: [
      "Dunyoning istalgan nuqtasidan tizimga 24/7/365 kirish",
      "Qisqa muddatda ulanish",
      "O‘zbek, rus va ingliz tillaridagi qulay interfeys",
      "To‘liq texnik yordam",
      "Yuqori malakali mutaxassislar",
      "Litsenziya va sertifikatlar",
      "Individual yondashuvli sohaviy yechimlar",
      "Arizalarga tez javob berish",
      "Turli ishlab chiqaruvchilar uskunalari bilan ishlash",
    ],

    systemModules: [
      { title: "Monitoring", text: "Holat, o‘t oldirish, sun’iy yo‘ldoshlar va yoqilg‘i bo‘yicha filtrli obyektlar ro‘yxati, obyekt kartochkasi va Excel’ga yuklash." },
      { title: "Treking", text: "Davr uchun trek, pleer va grafik: tezlik, o‘t oldirish, YSD ko‘rsatkichlari, quyish va quyib olishlar." },
      { title: "Qiziqish nuqtalari (PoI)", text: "Tashriflarni nazorat qilish uchun xaritadagi o‘z nuqtalaringiz, nomi va belgisi bilan." },
      { title: "Geozonalar (ZoI)", text: "Qiziqish zonalari: doira, poligon va chiziq, maydoni gektarda, kirish va chiqish hodisalari." },
      { title: "Xabarlar", text: "Obyektlardan kelgan xabarlar va uskuna bilan almashinuv tarixi." },
      { title: "Hisobotlar", text: "Tahliliy panellar: yurish, motosoatlar, bo‘sh turish, qoidabuzarliklar va yoqilg‘i sarfi." },
      { title: "Obyekt sozlamalari", text: "Belgi, trek parametrlari, tezlik va aloqa intervallari chegaralari, eko-haydash parametrlari." },
      { title: "Mobil ilova", text: "Android va iOS uchun UzGPS: obyektlar xaritada, treklar va hisobotlar telefonda." },
    ],

    objectStatuses: ["Harakatda", "To‘xtash", "Turargoh", "Aloqa yo‘qolgan", "Uzoq vaqt aloqa yo‘q", "Ma’lumot yo‘q"],

    equipmentKit: [
      {
        t: "GPS-trekerlar",
        d: "GPS-qabul qilgich va GSM-modemli ixcham qurilma: koordinata va tezlikni aniqlaydi hamda ma’lumotni GPRS orqali serverga uzatadi. Avtomobil va shaxsiy modellar.",
      },
      {
        t: "Yoqilg‘i sathi datchiklari",
        d: "YSD bakdagi yoqilg‘i miqdori va sarfini o‘lchaydi. Bak hajmi 50 litrdan ortiq transportga o‘rnatiladi: yuk mashinalari, maxsus texnika, avtobuslar.",
      },
      {
        t: "Qo‘shimcha uskunalar",
        d: "Haydovchini aniqlash (iButton), CAN-adapterlar, o‘qqa yuk datchigi, yo‘lovchi mavjudligi datchigi, treker uchun himoya boksi, dispetcherlik aloqasi.",
      },
    ],

    platformTabs: [
      {
        label: "Monitoring",
        title: "Har bir mashina ayni damda qayerda",
        points: ["Joylashuv va tezlik real vaqtda", "Holat, o‘t oldirish, sun’iy yo‘ldosh va yoqilg‘i bo‘yicha filtrlar", "Xarita qatlamlari: OSM, Google, Yandex"],
        caption: "«Monitoring» ekrani. Ro‘yxatdagi yoki xaritadagi obyektni bosing.",
      },
      {
        label: "Yoqilg‘i",
        title: "Quyib olish hodisa paytida ko‘rinadi",
        points: ["Tezlik, o‘t oldirish va YSD ko‘rsatkichlari grafigi", "Quyish va quyib olishlar trek hamda grafikda belgilanadi", "Bugun, kecha, hafta va oy uchun trek pleeri"],
        caption: "«Treking» ekrani: kunlik trek, tezlik va YSD grafigi, quyib olish va quyishlar bilan.",
      },
      {
        label: "Hisobotlar",
        title: "Taxmin emas, raqamlar",
        points: ["Yurish, motosoatlar va bo‘sh turish vaqti", "Tezlik va haydash uslubi buzilishlari", "Ma’lumotlarni Excel’ga yuklash"],
        caption: "«Hisobotlar» bo‘limi: Apache Superset asosidagi tahliliy panellar.",
      },
      {
        label: "Boshqaruv",
        title: "Masofadan boshqarish",
        points: ["Tezlik chegaralari va aloqa yo‘qolishi intervallari", "Eko-haydash parametrlari: tezlanish, tormozlash, burilish", "Obyekt belgisi va trek sozlamalari"],
        caption: "«Obyekt sozlamalari» bo‘limi: har bir mashina uchun parametrlar, belgilar va chegaralar.",
      },
    ],

    devices: {
      FMB920: {
        title: "Ixcham treker",
        text: "Yengil avtomobillar va o‘g‘irlikdan himoya uchun eng ommabop model. Yashirin o‘rnatish, ichki antennalar.",
        specs: ["GNSS / GSM", "Bluetooth 4.0", "Micro-SIM", "Ichki akselerometr"],
      },
      FMC920: { title: "Ixcham 4G treker", text: "Asosiy monitoring uchun LTE Cat 1 trekeri. Yashirin o‘rnatish va BLE datchiklarini ulash uchun qulay.", specs: ["4G LTE Cat 1", "Bluetooth LE", "Raqamli chiqish", "Ichki antennalar"] },
      FMB930: { title: "Elektr transport uchun treker", text: "Elektr mototsikl, moped va boshqa yengil elektr transport uchun keng quvvat diapazoniga ega ixcham model.", specs: ["10–90 V quvvat", "Kam energiya sarfi", "Bluetooth LE", "GNSS / GSM"] },
      FMB125: {
        title: "RS232 / RS485 li treker",
        text: "Yoqilg‘i sathi datchiklari (YSD) va tashqi uskunani ulash. Yuk mashinalari va maxsus texnika uchun.",
        specs: ["RS232 / RS485", "Yoqilg‘i datchiklari", "Bluetooth LE", "Kirish va chiqishlar"],
      },
      FMC125: { title: "RS232 / RS485 li 4G treker", text: "LTE Cat 1 orqali ma’lumot uzatadi, raqamli yoqilg‘i datchiklari va boshqa tashqi uskunalarni ulaydi.", specs: ["4G LTE Cat 1", "RS232 / RS485", "Dual SIM", "Yoqilg‘i nazorati"] },
      "EYE Sensor": { title: "Simsiz BLE datchik", text: "Harorat, namlik, harakat va eshik ochilishini qayd etadi. Yuk va tashish sharoitlarini kuzatishga yordam beradi.", specs: ["Harorat va namlik", "Harakat va magnit", "Bluetooth LE", "IP67 himoyasi"] },
      "EYE Beacon": { title: "Mulk uchun BLE mayoq", text: "Tirkama, asbob va boshqa mulkni mos treker yaqinida aniqlash uchun ixcham identifikator.", specs: ["Bluetooth LE", "Obyekt identifikatsiyasi", "IP67 himoyasi", "Uzoq batareya ishlashi"] },
      "Technoton DUT-E": { title: "Technoton yoqilg‘i datchigi", text: "Transport va statsionar baklarda yoqilg‘i qoldig‘i, to‘ldirish va kamayishni kuzatish uchun sath datchigi.", specs: ["Yoqilg‘i sathi", "To‘ldirish va kamayish", "Transport va rezervuarlar", "Simli ulanish"] },
      "Escort TD-BLE": { title: "Simsiz ЭСКОРТ yoqilg‘i datchigi", text: "Yoqilg‘i sathi ko‘rsatkichlarini trekerga signal kabelisiz Bluetooth LE orqali uzatadi.", specs: ["Bluetooth LE", "Yoqilg‘i nazorati", "Signal kabelisiz", "Bakka o‘rnatish"] },
      "Omnicomm LLS 4": { title: "Omnicomm yoqilg‘i datchigi", text: "Monitoring tizimida yoqilg‘i sathini va to‘ldirish yoki kamayish holatlarini aniq kuzatish uchun sig‘imli datchik.", specs: ["Yoqilg‘i sathi", "±1% aniqlik", "Harorat o‘lchovi", "Avtoparklar uchun"] },
      "Реле блокировки": { label: "Dvigatelni masofadan bloklash relesi", title: "Dvigatel ishga tushishini boshqarish", text: "Avtomobil relesi treker chiqishiga ulanadi va tizim to‘g‘ri sozlanganda dvigatelni ishga tushirishni masofadan cheklaydi. Rasmda rele namunasi ko‘rsatilgan.", specs: ["Treker orqali boshqaruv", "O‘g‘irlikdan himoya", "Elektr tizimga moslash", "Professional o‘rnatish"] },
      "Замки Jointech": { label: "Jointech elektron qulflari", title: "Yuk himoyasi", text: "Yukni ochishni nazorat qilish, konteyner yoki furgonni kuzatish uchun elektron qulf. Rasmda JT701 va ikkita JT709 qulf bor.", specs: ["Ochishni nazorat qilish", "GPS monitoring", "Masofadan boshqaruv", "Yuk himoyasi"] },
      FMB140: {
        title: "CAN-shinani o‘qish",
        text: "Bort kompyuteridan ma’lumot: haqiqiy sarf, aylanishlar, odometr bo‘yicha yurish.",
        specs: ["CAN-shina", "Xatolarni o‘qish", "Bluetooth 4.0", "Kirish va chiqishlar"],
      },
      FMC130: {
        title: "4G LTE treker",
        text: "Yangi avlod aloqasi, datchiklar va boshqaruv uchun raqamli hamda analog kirishlar.",
        specs: ["4G LTE Cat 1", "Analog kirishlar", "Impuls kirishlar", "Bluetooth 4.0"],
      },
      FMB003: {
        title: "OBD-treker",
        text: "OBD razyomiga bir daqiqada o‘rnatiladi, simlarni tortmasdan.",
        specs: ["OBD-II Plug&Play", "OEM CAN o‘qish", "Bluetooth 4.0", "Ixcham korpus"],
      },
      FMM920: {
        title: "Ixcham LTE Cat M1",
        text: "Yengil transport uchun kichik o‘lcham va past energiya sarfi.",
        specs: ["LTE Cat M1 / NB-IoT", "Energiya tejash", "Bluetooth 4.0", "Ixcham o‘lcham"],
      },
    },

    clientText: "UZGPS sun’iy yo‘ldosh monitoringi tizimidan foydalanadi.",
    clientDescriptions: {
      "c-hududgaz": "Milliy gaz taqsimlash kompaniyasi: O‘zbekistonning barcha hududlarida xonadonlar va korxonalarni tabiiy gaz bilan ta’minlaydi. UZGPS bilan avariya va xizmat brigadalari xaritada ko‘rinadi, tarmoqlarga xizmat ko‘rsatish yo‘nalishlari nazoratda bo‘ladi.",
      "c-ung": "O‘zbekiston neft-gaz sohasining milliy xolding kompaniyasi: neft va gazni qidirish, qazib olish, qayta ishlash va tashish. UZGPS konlardagi transport va maxsus texnika, yo‘nalishlar hamda yoqilg‘i sarfini nazorat qilishga yordam beradi.",
      "c-uztelecom": "Milliy aloqa operatori: magistral tarmoqlar, statsionar telefon, internet va Uzmobile mobil aloqasi. UZGPS bilan xizmat transporti va montaj brigadalari nazorat qilinadigan yo‘nalishlarda ishlaydi.",
      "c-karantin": "Qishloq xo‘jaligi vazirligi huzuridagi O‘simliklar karantini va himoyasi agentligi: chegarada va mamlakat ichida fitosanitar nazorat, ekinlarni zararkunandalardan himoya qilish. UZGPS inspeksiya guruhlari xizmat transportini kuzatadi.",
      "c-iiv": "Ichki ishlar vazirligi — 1991-yildan buyon jamoat tartibini saqlash va O‘zbekiston politsiyasi faoliyati uchun mas’ul organ. UZGPS xizmat transportini real vaqtda ko‘rsatadi va yo‘nalishlar tarixini saqlaydi.",
      "c-safe-city": "«Xavfsiz shahar» — IIV huzuridagi markaz rivojlantirayotgan umummilliy videokuzatuv, qoidabuzarliklarni qayd etish va tezkor javob berish tizimi. UZGPS ma’lumotlari dispetcherlarga ekipajlarni ko‘rish va eng yaqinini yo‘naltirishga yordam beradi.",
      "c-national-guard": "Milliy gvardiya — Qurolli Kuchlar tarkibidagi mustaqil tuzilma, jamoat tartibi va muhim davlat obyektlarini qo‘riqlaydi. UZGPS bo‘linmalar transportini muvofiqlashtirish va topshiriqlar bajarilishini nazorat qilishga yordam beradi.",
      "c-security": "Milliy gvardiya Qo‘riqlash xizmati davlat obyektlarini hamda fuqaro va tashkilotlar mulkini shartnoma asosida qo‘riqlaydi, faoliyati 1952-yildan boshlangan. UZGPS bilan tezkor guruhlar doimo xaritada ko‘rinadi.",
      "c-guard-troops": "1999-yilda tashkil etilgan IIV Qorovul qo‘shinlari konvoy, muassasalarni qo‘riqlash va aeroportlar xavfsizligini ta’minlaydi. UZGPS GPS-nazorati har bir yo‘nalish va undan chetga chiqishni qayd etadi.",
      "c-mchs": "Favqulodda vaziyatlar vazirligi 1996-yildan buyon tabiiy ofatlar va texnogen avariyalarning oldini oladi va oqibatlarini bartaraf etadi, qutqaruv va yong‘in xizmatlariga rahbarlik qiladi. UZGPS ekipajlarning aniq joylashuvi va yetib kelish vaqtini ko‘rsatadi.",
      "c-cabinet": "Vazirlar Mahkamasi — O‘zbekiston Respublikasi ijro etuvchi hokimiyatining oliy organi. UZGPS xizmat avtoparkini nazorat qilishga yordam beradi: harakat, safarlar tarixi va yoqilg‘i sarfi.",
      "c-lukoil": "Dunyodagi yirik energetika kompaniyalaridan biri va O‘zbekiston gaz qazib olishidagi yetakchi xorijiy investor — Qandim, Hisor va Janubi-g‘arbiy Hisor loyihalari. UZGPS texnikaning yo‘nalishlari, bekor turishi va yoqilg‘i sarfini nazorat qiladi.",
      "c-railways": "1994-yilda tashkil etilgan milliy temir yo‘l kompaniyasi: infratuzilma, yuk va yo‘lovchi tashish, jumladan «Afrosiyob» tezyurar poyezdlari. UZGPS soha xizmat avtotransporti va texnikasini nazorat qilishga yordam beradi.",
      "c-airways": "Toshkent xalqaro aeroportida bazalashgan, ichki va xalqaro reyslarni amalga oshiruvchi O‘zbekistonning milliy aviatashuvchisi. UZGPS yer usti transportini — yo‘nalishlar va topshiriqlarning o‘z vaqtida bajarilishini nazorat qiladi.",
      "c-agroleasing": "Fermer va agroxo‘jaliklarni traktor, kombayn va boshqa qishloq xo‘jaligi texnikasi bilan lizing asosida ta’minlovchi kompaniya. UZGPS texnika qayerda ishlayotgani, qancha yurgani va qanday foydalanilayotganini ko‘rsatadi.",
    },
    clientIndustries: {
      c103: "Favqulodda xizmatlar",
      "c-hududgaz": "Gaz ta’minoti",
      "c-ung": "Neft-gaz sohasi",
      "c-uztelecom": "Telekommunikatsiyalar",
      "c-karantin": "Fitosanitar nazorat",
      "c-iiv": "Huquqni muhofaza qilish organlari",
      "c-safe-city": "Shahar xavfsizligi",
      "c-national-guard": "Milliy gvardiya",
      "c-security": "Obyektlarni qo‘riqlash",
      "c-guard-troops": "Harbiylashtirilgan qo‘riqlash",
      "c-mchs": "Qutqaruv xizmatlari",
      "c-cabinet": "Davlat boshqaruvi",
      "c-lukoil": "Energetika",
      "c-railways": "Temir yo‘l transporti",
      "c-airways": "Aviatsiya",
      "c-agroleasing": "Qishloq xo‘jaligi texnikasi va lizing",
    },
    featured: {
      name: "Respublika shoshilinch tibbiy yordam markazi",
      short: "103 xizmati",
      text: "Respublika tez yordam xizmati mashinalari UZGPS sun’iy yo‘ldosh monitoringi tizimidan foydalanadi.",
    },
  },
};
