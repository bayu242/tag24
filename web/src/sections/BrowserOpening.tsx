import { Check } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { Container } from "../components/Container";

const POINTS = ["browser.point1", "browser.point2", "browser.point3"];

export function BrowserOpening() {
  const { t } = useLanguage();

  return (
    <section className="border-b border-line bg-primary-soft py-20 md:py-28">
      <Container>
        <h2 className="max-w-[24ch] font-display text-[32px] leading-tight text-ink md:text-[40px]">
          {t("browser.title")}
        </h2>
        <p className="mt-4 max-w-[56ch] text-[17px] leading-7 text-ink/75">
          {t("browser.subtitle")}
        </p>

        <ul className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-3">
          {POINTS.map((key) => (
            <li key={key} className="flex gap-3">
              <Check size={18} className="mt-0.5 shrink-0 text-accent" />
              <span className="text-[15px] leading-6 text-ink/80">{t(key)}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
