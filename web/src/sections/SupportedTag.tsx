import { useLanguage } from "../i18n/useLanguage";
import { Container } from "../components/Container";

const SPECS = [
  { labelKey: "tag.spec.type.label", valueKey: "tag.spec.type.value", wide: true },
  { labelKey: "tag.spec.capacity.label", valueKey: "tag.spec.capacity.value", wide: false },
  { labelKey: "tag.spec.format.label", valueKey: "tag.spec.format.value", wide: false },
  { labelKey: "tag.spec.content.label", valueKey: "tag.spec.content.value", wide: false },
  { labelKey: "tag.spec.locked.label", valueKey: "tag.spec.locked.value", wide: false },
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
      </Container>
    </section>
  );
}
