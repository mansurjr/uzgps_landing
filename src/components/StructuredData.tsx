import { contacts, problems } from "@/data/content";
import { SITE } from "@/lib/site";

/**
 * schema.org graph for the landing page: the company, the site, the СМПО product
 * and the question/answer pairs shown in the «Знакомо?» block.
 */
export default function StructuredData() {
  const org = {
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: { "@type": "ImageObject", url: `${SITE.url}/brand/pin.svg` },
    image: `${SITE.url}/opengraph-image`,
    description: SITE.description,
    foundingDate: SITE.founded,
    areaServed: { "@type": "Country", name: "Узбекистан" },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    email: contacts.email,
    telephone: "+998712074444",
    contactPoint: [
      { "@type": "ContactPoint", telephone: "+998712074444", contactType: "sales", areaServed: "UZ", availableLanguage: ["ru", "uz", "en"] },
      { "@type": "ContactPoint", telephone: "+998712305544", contactType: "technical support", areaServed: "UZ", availableLanguage: ["ru", "uz"] },
    ],
    sameAs: SITE.sameAs,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: "ru-UZ",
    publisher: { "@id": `${SITE.url}/#organization` },
  };

  const product = {
    "@type": "SoftwareApplication",
    "@id": `${SITE.url}/#smpo`,
    name: "СМПО UZGPS",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Fleet management, GPS tracking",
    operatingSystem: "Web, Android, iOS",
    inLanguage: ["ru", "uz", "en"],
    url: SITE.url,
    publisher: { "@id": `${SITE.url}/#organization` },
    description:
      "Система мониторинга подвижных объектов: онлайн-карта, трекинг с графиком скорости и показаний ДУТ, геозоны и точки интереса, отчёты и настройки объектов.",
    featureList: [
      "Мониторинг объектов в реальном времени",
      "Трекинг с плеером и графиком скорости, зажигания и топлива",
      "Контроль заправок и сливов по датчикам уровня топлива",
      "Геозоны (ZoI) и точки интереса (PoI)",
      "Отчёты и выгрузка в Excel",
      "Лимиты скорости, интервалы связи и параметры эко-вождения",
    ],
    softwareHelp: `${SITE.url}/#platform`,
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${SITE.url}/#faq`,
    mainEntity: problems.map((p) => ({
      "@type": "Question",
      name: p.q,
      acceptedAnswer: { "@type": "Answer", text: p.a },
    })),
  };

  const graph = { "@context": "https://schema.org", "@graph": [org, website, product, faq] };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}
