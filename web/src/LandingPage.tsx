import { useLanguage } from "./i18n/useLanguage";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { Fields } from "./sections/Fields";
import { Hero } from "./sections/Hero";
import { HowItWorks } from "./sections/HowItWorks";
import { SupportedTag } from "./sections/SupportedTag";

export function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[100dvh] bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-on-primary"
      >
        {t("common.skipToContent")}
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <HowItWorks />
        <Fields />
        <SupportedTag />
      </main>
      <Footer />
    </div>
  );
}
