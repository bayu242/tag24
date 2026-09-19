import { Download } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { TagPreviewCard } from "../components/TagPreviewCard";
import { APK_URL, sampleTagData } from "../lib/site";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="border-b border-line">
      <Container>
        <div className="grid items-center gap-12 pt-16 pb-16 md:pt-24 md:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="rise-in">
            <h1 className="max-w-[16ch] font-display text-[40px] leading-[1.04] tracking-tight text-ink md:text-[56px] lg:text-[64px]">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-[48ch] text-[17px] leading-7 text-ink/75 md:text-[19px]">
              {t("hero.subtitle")}
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
            </div>
          </div>

          <div className="rise-in lg:pl-6" style={{ animationDelay: "120ms" }}>
            <TagPreviewCard data={sampleTagData} />
          </div>
        </div>
      </Container>
    </section>
  );
}
