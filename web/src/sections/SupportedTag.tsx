import { ExternalLink } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { Container } from "../components/Container";
import { NFC_TOOLS_URL } from "../lib/site";

const SPECS = [
  { labelKey: "tag.spec.type.label", valueKey: "tag.spec.type.value", wide: true },
  { labelKey: "tag.spec.capacity.label", valueKey: "tag.spec.capacity.value", wide: false },
  { labelKey: "tag.spec.format.label", valueKey: "tag.spec.format.value", wide: false },
  { labelKey: "tag.spec.content.label", valueKey: "tag.spec.content.value", wide: false },
  { labelKey: "tag.spec.locked.label", valueKey: "tag.spec.locked.value", wide: false },
];

const TUTORIAL_STEPS = [
  "tag.tutorial.step1",
  "tag.tutorial.step2",
  "tag.tutorial.step3",
  "tag.tutorial.step4",
  "tag.tutorial.step5",
  "tag.tutorial.step6",
];

export function SupportedTag() {
  const { t } = useLanguage();

  return (
    <section id="tag" className="border-b border-line py-20 md:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="max-w-[22ch] font-display text-[32px] leading-tight text-ink md:text-[40px]">
              {t("tag.title")}
            </h2>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-7 text-ink/75">{t("tag.subtitle")}</p>
          </div>

          <dl className="grid grid-cols-2 gap-3">
            {SPECS.map((spec) => (
              <div
                key={spec.labelKey}
                className={`rounded-lg border border-line bg-background p-4 shadow-card ${
                  spec.wide ? "col-span-2" : ""
                }`}
              >
                <dt className="text-[12px] uppercase tracking-[0.08em] text-ink/65">
                  {t(spec.labelKey)}
                </dt>
                <dd className="mt-1.5 font-display text-[22px] leading-tight text-ink">
                  {t(spec.valueKey)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-12 rounded-lg border border-line bg-primary-soft p-6 md:mt-16 md:p-8">
          <h3 className="max-w-[24ch] font-display text-[24px] leading-tight text-ink md:text-[28px]">
            {t("tag.tutorial.title")}
          </h3>
          <p className="mt-3 max-w-[62ch] text-[16px] leading-7 text-ink/75">
            {t("tag.tutorial.body")}
          </p>

          <ol className="mt-5 grid gap-2.5">
            {TUTORIAL_STEPS.map((key, index) => (
              <li key={key} className="flex gap-3 text-[15px] leading-6 text-ink/80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[12px] font-semibold text-on-primary">
                  {index + 1}
                </span>
                <span className="pt-0.5">{t(key)}</span>
              </li>
            ))}
          </ol>

          <a
            href={NFC_TOOLS_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-line bg-background px-4 py-2.5 text-[15px] font-medium text-ink transition-colors duration-200 ease-brand hover:border-accent hover:text-accent"
          >
            <ExternalLink size={16} className="text-accent" />
            {t("tag.tutorial.link")}
          </a>
        </div>
      </Container>
    </section>
  );
}
