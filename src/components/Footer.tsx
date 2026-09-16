import { Logo } from "./Header";
import { contacts, industries } from "@/data/content";

const company = [
  { href: "#platform", label: "Платформа" },
  { href: "#equipment", label: "Оборудование" },
  { href: "#calculator", label: "Калькулятор экономии" },
  { href: "#about", label: "О компании" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo inverted />
          <p className="mt-5 max-w-[300px] text-[15px] leading-relaxed text-paper/55">
            Спутниковый мониторинг транспорта и персонала. Центр программистов BePro, Ташкент.
          </p>
        </div>
        <FooterCol title="Решения">
          {industries.map((i) => (
            <li key={i.title}>
              <a href="#solutions" className="hover:text-primary">
                {i.title}
              </a>
            </li>
          ))}
        </FooterCol>
        <FooterCol title="Компания">
          {company.map((c) => (
            <li key={c.label}>
              <a href={c.href} className="hover:text-primary">
                {c.label}
              </a>
            </li>
          ))}
        </FooterCol>
        <FooterCol title="Контакты">
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
          <span>© 2014–{new Date().getFullYear()} UZGPS. Все права защищены.</span>
          <a href="https://uzgps.uz/mobileprivacy" className="hover:text-paper">
            Политика конфиденциальности
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
