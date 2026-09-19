import { ExternalLink, Nfc } from "lucide-react";
import type { TagData } from "tag";
import { buildTagLinkById, initialTagDataTypes } from "tag";
import { useLanguage } from "../i18n/useLanguage";

export function TagResult({ data }: { data: TagData }) {
  const { t } = useLanguage();
  const entries = initialTagDataTypes.filter((type) => (data[type.id] ?? "").length > 0);
  const name = data.nm;
  const rows = entries.filter((type) => type.id !== "nm");

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-background shadow-card">
      <div className="flex items-center gap-4 border-b border-line bg-primary-soft px-6 py-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-on-primary">
          <Nfc size={22} />
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-[24px] leading-tight text-ink">
            {name ?? t("parser.nameFallback")}
          </p>
          <p className="text-[13px] text-ink/60">{t("parser.fields", { count: entries.length })}</p>
        </div>
      </div>

      <div className="divide-y divide-line px-6">
        {rows.map((type) => {
          const value = data[type.id];
          const href = buildTagLinkById(type.id, value);
          const external = href?.startsWith("http") ?? false;

          return (
            <div key={type.id} className="flex items-start justify-between gap-6 py-4">
              <span className="pt-0.5 text-[12px] uppercase tracking-[0.08em] text-ink/55">
                {t(`field.${type.id}`, undefined, type.name)}
              </span>
              {href ? (
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="inline-flex items-center gap-1.5 text-right text-[16px] font-medium text-accent hover:underline"
                >
                  <span className="break-all">{value}</span>
                  <ExternalLink size={14} className="shrink-0" />
                </a>
              ) : (
                <span className="text-right text-[16px] font-medium break-words text-ink">
                  {value}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
