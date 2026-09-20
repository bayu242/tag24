import { Link2 } from "lucide-react";
import type { TagDataType } from "tag";
import { getTagDataType } from "tag";
import { useLanguage } from "../i18n/useLanguage";
import { Container } from "../components/Container";

const GROUPS: { titleKey: string; ids: string[] }[] = [
  { titleKey: "fields.group.contact", ids: ["nm", "ph", "em", "wa", "ad"] },
  { titleKey: "fields.group.social", ids: ["ig", "tw", "th", "fb", "li", "yt", "tt"] },
  { titleKey: "fields.group.music", ids: ["sp", "sa"] },
  { titleKey: "fields.group.extras", ids: ["pet", "nt"] },
];

function FieldChip({
  type,
  label,
  charsLabel,
}: {
  type: TagDataType;
  label: string;
  charsLabel: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-line bg-background px-3 py-2">
      <span className="text-[15px] font-medium text-ink">{label}</span>
      <span className="text-[12px] text-ink/65">{charsLabel}</span>
      {type.linkTemplate ? <Link2 size={13} className="text-accent" /> : null}
    </span>
  );
}

export function Fields() {
  const { t } = useLanguage();

  return (
    <section id="fields" className="border-b border-line py-20 md:py-28">
      <Container>
        <h2 className="max-w-[26ch] font-display text-[32px] leading-tight text-ink md:text-[40px]">
          {t("fields.title")}
        </h2>
        <p className="mt-4 max-w-[56ch] text-[17px] leading-7 text-ink/75">
          {t("fields.subtitle")}
        </p>

        <div className="mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-2">
          {GROUPS.map((group) => (
            <div key={group.titleKey}>
              <h3 className="font-display text-[22px] leading-tight text-ink">
                {t(group.titleKey)}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.ids.map((id) => {
                  const type = getTagDataType(id);
                  if (!type) return null;
                  return (
                    <FieldChip
                      key={id}
                      type={type}
                      label={t(`field.${id}`, undefined, type.name)}
                      charsLabel={t("common.chars", { count: type.maxChar })}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
