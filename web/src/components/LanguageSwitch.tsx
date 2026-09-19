import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { LANGUAGES } from "../i18n/translations";
import { useLanguage } from "../i18n/useLanguage";

export function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((item) => item.code === language);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language.title")}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 items-center gap-1.5 rounded-md border border-line px-3 text-ink transition-colors duration-200 ease-brand hover:border-accent hover:text-accent"
      >
        <Globe size={16} />
        <span className="text-[13px] font-semibold">
          {current?.short ?? language.toUpperCase()}
        </span>
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-md border border-line bg-background shadow-card"
        >
          {LANGUAGES.map((option) => {
            const active = option.code === language;
            return (
              <li key={option.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLanguage(option.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-[15px] transition-colors duration-200 ease-brand hover:bg-accent-soft ${
                    active ? "text-accent" : "text-ink"
                  }`}
                >
                  {option.label}
                  {active ? <Check size={16} /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
