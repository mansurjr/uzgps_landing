import { Logo } from "./Header";
import { contacts } from "@/data/content";
import type { Dict } from "@/i18n";

export default function Footer({ t }: { t: Dict }) {
  const company = [
    { href: "#platform", label: t.nav.platform },
    { href: "#equipment", label: t.nav.equipment },
    { href: "#calculator", label: t.footer.calculator },
    { href: "#about", label: t.nav.about },
    { href: contacts.login, label: t.common.login },
  ];

  return (
    <footer className="bg-ink text-paper">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo inverted />
          <p className="mt-5 max-w-[300px] text-[15px] leading-relaxed text-paper/55">{t.footer.about}</p>
        </div>
        <FooterCol title={t.footer.solutions}>
          {t.content.industries.slice(0, 6).map((i) => (
            <li key={i.title}>
              <a href="#solutions" className="hover:text-primary">
                {i.title}
              </a>
            </li>
          ))}
        </FooterCol>
        <FooterCol title={t.footer.company}>
          {company.map((c) => (
            <li key={c.label}>
              <a href={c.href} className="hover:text-primary">
                {c.label}
              </a>
            </li>
          ))}
        </FooterCol>
        <FooterCol title={t.footer.contacts}>
          <li>
            <a href={contacts.salesHref} className="num hover:text-primary">
              {contacts.sales}
            </a>
          </li>
          <li>
            <a href={`mailto:${contacts.email}`} className="hover:text-primary">
              {contacts.email}
            </a>
          </li>
          <li>{contacts.address}</li>
          <li className="flex gap-5 pt-2">
            <a href={contacts.telegram} target="_blank" rel="noreferrer" className="hover:text-primary">
              Telegram
            </a>
            <a href={contacts.facebook} target="_blank" rel="noreferrer" className="hover:text-primary">
              Facebook
            </a>
          </li>
        </FooterCol>
      </div>
      <div className="border-t border-rule-inv">
        <div className="wrap flex flex-col justify-between gap-3 py-6 text-[13px] text-paper/45 sm:flex-row">
          <span>
            © 2014–{new Date().getFullYear()} UZGPS. {t.footer.rights}
          </span>
          <a href={contacts.privacy} className="hover:text-paper">
            {t.contact.policy}
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[14px] text-paper/45">{title}</p>
      <ul className="mt-4 space-y-2.5 text-[15px] text-paper/85">{children}</ul>
    </div>
  );
}
