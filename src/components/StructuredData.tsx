import { contacts } from "@/data/content";
import type { Dict, Locale } from "@/i18n";
import { SITE, localeUrl } from "@/lib/site";

/**
 * schema.org graph for the landing page: the company, the site, the СМПО product
 * and the question/answer pairs shown in the «Знакомо?» block.
 */
export default function StructuredData({ t, locale }: { t: Dict; locale: Locale }) {
  const pageUrl = localeUrl(locale);
  const org = {
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    description: t.seo.description,
    url: SITE.url,
    logo: { "@type": "ImageObject", url: `${SITE.url}/brand/pin.svg` },
    image: `${pageUrl}opengraph-image`.replace("//opengraph", "/opengraph"),
    foundingDate: SITE.founded,
    areaServed: { "@type": "Country", name: "Uzbekistan" },
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
    url: pageUrl,
    name: SITE.name,
    description: t.seo.description,
    inLanguage: locale === "uz" ? "uz-UZ" : "ru-UZ",
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
    url: pageUrl,
    publisher: { "@id": `${SITE.url}/#organization` },
    description: t.seo.description,
    featureList: t.content.systemModules.map((m) => m.title),
    softwareHelp: `${pageUrl}#platform`,
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${SITE.url}/#faq`,
    mainEntity: t.content.problems.map((p) => ({
      "@type": "Question",
      name: p.q,
      acceptedAnswer: { "@type": "Answer", text: p.a },
    })),
  };

  const graph = { "@context": "https://schema.org", "@graph": [org, website, product, faq] };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}
