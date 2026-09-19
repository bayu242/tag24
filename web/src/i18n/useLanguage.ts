import { useContext } from "react";
import type { LanguageContextValue } from "./context";
import { LanguageContext } from "./context";

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
