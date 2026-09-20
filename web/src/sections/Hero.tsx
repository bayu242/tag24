import { Download, Nfc, WifiOff } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { AppScreenshots } from "../components/AppScreenshots";
import { APK_URL, REPO_URL } from "../lib/site";
import githubIcon from "../assets/icons/github.svg";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="overflow-hidden border-b border-line">
      <Container>
        <div className="grid items-center gap-12 pt-16 pb-16 md:pt-24 md:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="rise-in">
            <span className="inline-flex items-center gap-2 rounded-xl border border-line bg-primary-soft px-3 py-1.5 text-[13px] font-semibold text-accent">
              <Nfc size={14} />
              {t("hero.eyebrow")}
            </span>
            <h1 className="mt-5 max-w-[16ch] font-display text-[40px] leading-[1.04] tracking-tight text-ink md:text-[56px] lg:text-[64px]">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-[48ch] text-[17px] leading-7 text-ink/75 md:text-[19px]">
              {t("hero.subtitle")}
            </p>
            <p className="mt-4 flex max-w-[48ch] items-start gap-2 text-[15px] leading-6 text-ink/70">
              <WifiOff size={16} className="mt-0.5 shrink-0 text-accent" />
              {t("hero.offline")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={APK_URL}
                external
                variant="accent"
                size="lg"
                icon={<Download size={18} />}
              >
                {t("common.getApp")}
              </Button>
              <Button href="#how-it-works" variant="secondary" size="lg">
                {t("hero.secondary")}
              </Button>
              <Button
                href={REPO_URL}
                external
                variant="secondary"
                size="lg"
                icon={<img src={githubIcon} alt="" className="h-5 w-5" />}
              >
                {t("hero.github")}
              </Button>
            </div>
          </div>

          <div className="rise-in lg:pl-6" style={{ animationDelay: "120ms" }}>
            <AppScreenshots />
          </div>
        </div>
      </Container>
    </section>
  );
}
