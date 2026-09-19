import { useLanguage } from "../i18n/useLanguage";
import { Container } from "../components/Container";

const SPECS = [
  { labelKey: "tag.spec.type.label", valueKey: "tag.spec.type.value" },
  { labelKey: "tag.spec.capacity.label", valueKey: "tag.spec.capacity.value" },
  { labelKey: "tag.spec.format.label", valueKey: "tag.spec.format.value" },
  { labelKey: "tag.spec.content.label", valueKey: "tag.spec.content.value" },
  { labelKey: "tag.spec.locked.label", valueKey: "tag.spec.locked.value" },
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

          <div className="rounded-lg border border-line bg-background p-6 shadow-card">
            <dl className="divide-y divide-line">
              {SPECS.map((spec) => (
                <div
                  key={spec.labelKey}
                  className="flex items-baseline justify-between gap-4 py-3.5"
                >
                  <dt className="text-[13px] uppercase tracking-[0.06em] text-ink/55">
                    {t(spec.labelKey)}
                  </dt>
                  <dd className="text-right text-[15px] font-medium text-ink">
                    {t(spec.valueKey)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
