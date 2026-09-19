import { Nfc, PenLine, RefreshCw, ScanLine } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { Container } from "../components/Container";

const STEPS = [
  { icon: PenLine, titleKey: "how.write.title", bodyKey: "how.write.body" },
  { icon: Nfc, titleKey: "how.tap.title", bodyKey: "how.tap.body" },
  { icon: ScanLine, titleKey: "how.read.title", bodyKey: "how.read.body" },
  { icon: RefreshCw, titleKey: "how.edit.title", bodyKey: "how.edit.body" },
];

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="border-b border-line py-20 md:py-28">
      <Container>
        <h2 className="max-w-[24ch] font-display text-[32px] leading-tight text-ink md:text-[40px]">
          {t("how.title")}
        </h2>
        <p className="mt-4 max-w-[52ch] text-[17px] leading-7 text-ink/75">{t("how.subtitle")}</p>

        <div className="relative mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden="true"
            className="absolute top-6 left-[11%] right-[11%] hidden h-px bg-line lg:block"
          />
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.titleKey} className="relative flex flex-col items-center text-center">
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-md bg-primary-soft text-accent">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-[22px] leading-tight text-ink">
                  {t(step.titleKey)}
                </h3>
                <p className="mt-2 max-w-[30ch] text-[15px] leading-6 text-ink/70">
                  {t(step.bodyKey)}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
