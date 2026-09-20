import { Nfc } from "lucide-react";
import type { TagData } from "tag";
import { hasTagValue, initialTagDataTypes, tagValues } from "tag";
import { useLanguage } from "../i18n/useLanguage";

type TagPreviewCardProps = {
  data: TagData;
  className?: string;
};

export function TagPreviewCard({ data, className = "" }: TagPreviewCardProps) {
  const { t } = useLanguage();
  const entries = initialTagDataTypes.filter((type) => hasTagValue(data[type.id]));
  const name = tagValues(data.nm)[0];
  const rows = entries.filter((type) => type.id !== "nm");

  return (
    <div
      className={`overflow-hidden rounded-lg border border-line bg-background shadow-card ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-line bg-primary-soft px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-on-primary">
          <Nfc size={20} />
        </span>
        <div>
          <p className="font-display text-lg leading-tight text-ink">{t("preview.title")}</p>
          <p className="text-[12px] text-ink/60">{t("preview.sample")}</p>
        </div>
      </div>

      <div className="px-5 py-5">
        {name ? (
          <p className="font-display text-[30px] leading-tight text-ink">{name}</p>
        ) : null}

        <div className="mt-4 divide-y divide-line">
          {rows.map((type) => (
            <div key={type.id} className="flex items-start justify-between gap-4 py-3">
              <span className="pt-0.5 text-[11px] uppercase tracking-[0.08em] text-ink/65">
                {t(`field.${type.id}`, undefined, type.name)}
              </span>
              <span className="text-right text-[15px] font-medium text-ink">
                {tagValues(data[type.id]).join(", ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
