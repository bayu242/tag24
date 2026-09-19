import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { BrowserOpening } from "./sections/BrowserOpening";
import { Download } from "./sections/Download";
import { Fields } from "./sections/Fields";
import { Hero } from "./sections/Hero";
import { HowItWorks } from "./sections/HowItWorks";
import { SupportedTag } from "./sections/SupportedTag";

export function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Fields />
        <BrowserOpening />
        <SupportedTag />
        <Download />
      </main>
      <Footer />
    </div>
  );
}
