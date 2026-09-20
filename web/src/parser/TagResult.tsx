import { useState } from "react";
import { Check, Copy, ExternalLink, Eye, EyeOff, Nfc } from "lucide-react";
import type { TagData } from "tag";
import {
  buildTagLinkById,
  compositeValue,
  hasTagValue,
  initialTagDataTypes,
  tagValues,
} from "tag";
import { useLanguage } from "../i18n/useLanguage";
import { getFieldIcon } from "../lib/fieldIcons";

function CompositeRow({
  label,
  value,
  secret = false,
}: {
  label: string;
  value: string;
  secret?: boolean;
}) {
  const { t } = useLanguage();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const shown = secret && !revealed ? "•".repeat(Math.min(value.length, 12)) : value;

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable; keep the value visible instead.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-line bg-background px-3 py-2">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.08em] text-ink/65">{label}</p>
        <p className="mt-0.5 break-all font-medium text-ink">{shown}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {secret ? (
          <button
            type="button"
            onClick={() => setRevealed((current) => !current)}
            aria-label={revealed ? t("parser.hide") : t("parser.reveal")}
            className="rounded p-1.5 text-ink/60 hover:bg-primary-soft hover:text-ink"
          >
            {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        ) : null}
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? t("parser.copied") : t("parser.copy")}
          className="rounded p-1.5 text-ink/60 hover:bg-primary-soft hover:text-ink"
        >
          {copied ? <Check size={15} className="text-accent" /> : <Copy size={15} />}
        </button>
      </div>
    </div>
  );
}

const SPOTIFY_EMBED_TEMPLATES: Record<string, string> = {
  sp: "https://open.spotify.com/embed/playlist/{value}",
  sa: "https://open.spotify.com/embed/album/{value}",
};

function buildSpotifyEmbed(id: string, value: string): string | undefined {
  const template = SPOTIFY_EMBED_TEMPLATES[id];
  return template ? template.replace("{value}", value) : undefined;
}

export function TagResult({ data }: { data: TagData }) {
  const { t } = useLanguage();
  const entries = initialTagDataTypes.filter((type) => hasTagValue(data[type.id]));
  const name = tagValues(data.nm)[0];
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
          const values = tagValues(data[type.id]);
          const composite = compositeValue(data[type.id]);
          const label = t(`field.${type.id}`, undefined, type.name);
          const icon = getFieldIcon(type.id);
          const embeds = values
            .map((value) => buildSpotifyEmbed(type.id, value))
            .filter((src): src is string => Boolean(src));

          if (composite) {
            return (
              <div key={type.id} className="py-4">
                <span className="flex items-center gap-2 text-[12px] uppercase tracking-[0.08em] text-ink/65">
                  {icon ? (
                    <img src={icon} alt="" aria-hidden className="h-4 w-4 shrink-0" />
                  ) : null}
                  {label}
                </span>
                <div className="mt-3 flex flex-col gap-2">
                  {(type.fields ?? []).map((sub) => {
                    const value = composite[sub.id];
                    if (!value) return null;
                    return (
                      <CompositeRow
                        key={sub.id}
                        label={t(`field.${type.id}.${sub.id}`, undefined, sub.name)}
                        value={value}
                        secret={sub.secret}
                      />
                    );
                  })}
                </div>
              </div>
            );
          }

          if (embeds.length > 0) {
            return (
              <div key={type.id} className="py-4">
                <span className="flex items-center gap-2 text-[12px] uppercase tracking-[0.08em] text-ink/65">
                  {icon ? (
                    <img src={icon} alt="" aria-hidden className="h-4 w-4 shrink-0" />
                  ) : null}
                  {label}
                </span>
                <div className="mt-3 flex flex-col gap-3">
                  {embeds.map((src, index) => (
                    <iframe
                      key={index}
                      title={label}
                      src={src}
                      className="w-full rounded-xl border-0"
                      height={352}
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={type.id} className="flex items-start justify-between gap-6 py-4">
              <span className="flex items-center gap-2 pt-0.5 text-[12px] uppercase tracking-[0.08em] text-ink/65">
                {icon ? <img src={icon} alt="" aria-hidden className="h-4 w-4 shrink-0" /> : null}
                {label}
              </span>
              <div className="flex flex-col items-end gap-1">
                {values.map((value, index) => {
                  const href = buildTagLinkById(type.id, value);
                  const external = href?.startsWith("http") ?? false;
                  return href ? (
                    <a
                      key={index}
                      href={href}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="inline-flex items-center gap-1.5 text-right text-[16px] font-medium text-accent hover:underline"
                    >
                      <span className="break-all">{value}</span>
                      <ExternalLink size={14} className="shrink-0" />
                    </a>
                  ) : (
                    <span
                      key={index}
                      className="text-right text-[16px] font-medium break-words text-ink"
                    >
                      {value}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
