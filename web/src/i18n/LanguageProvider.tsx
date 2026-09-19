import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Vars } from "./context";
import { LanguageContext } from "./context";
import type { Language, Message } from "./translations";
import { translations } from "./translations";

const STORAGE_KEY = "tag24.web.language";
const DEFAULT_LANGUAGE: Language = "id";

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    vars[name] !== undefined ? String(vars[name]) : `{${name}}`,
  );
}

function resolve(message: Message, vars?: Vars): string {
  if (typeof message === "string") return interpolate(message, vars);
  const count = Number(vars?.count ?? 0);
  return interpolate(count === 1 ? message.one : message.other, vars);
}

function readStoredLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "id") return stored;
  } catch {
    // Ignore storage access errors.
  }
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage access errors.
    }
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, []);

  const t = useCallback(
    (key: string, vars?: Vars, fallback?: string) => {
      const message = translations[language][key];
      if (message === undefined) return interpolate(fallback ?? key, vars);
      return resolve(message, vars);
    },
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
