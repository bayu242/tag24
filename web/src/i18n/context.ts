import { createContext } from "react";
import type { Language } from "./translations";

export type Vars = Record<string, string | number>;

export type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, vars?: Vars, fallback?: string) => string;
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);
