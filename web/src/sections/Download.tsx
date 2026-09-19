import { Download as DownloadIcon } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { APK_URL } from "../lib/site";

export function Download() {
  const { t } = useLanguage();

  return (
    <section id="download" className="py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-[720px] rounded-lg border border-line bg-accent-soft px-6 py-14 text-center md:px-12">
          <h2 className="font-display text-[32px] leading-tight text-ink md:text-[40px]">
            {t("download.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-[44ch] text-[17px] leading-7 text-ink/75">
            {t("download.subtitle")}
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              href={APK_URL}
              external
              variant="accent"
              size="lg"
              icon={<DownloadIcon size={18} />}
            >
              {t("common.getApp")}
            </Button>
          </div>
          <p className="mt-4 text-[13px] text-ink/55">{t("download.note")}</p>
        </div>
      </Container>
    </section>
  );
}
