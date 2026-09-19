import { useLanguage } from "../i18n/useLanguage";
import { APK_URL, REPO_URL } from "../lib/site";
import { Container } from "./Container";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-line py-14">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[38ch]">
            <span className="font-display text-[22px] leading-none">Tag24</span>
            <p className="mt-3 text-[14px] leading-6 text-ink/60">
              {t("footer.description")}
            </p>
          </div>

          <div className="flex gap-14">
            <div>
              <p className="text-[13px] font-semibold text-ink/50">
                {t("footer.app")}
              </p>
              <ul className="mt-3 space-y-2 text-[14px]">
                <li>
                  <a
                    href="#how-it-works"
                    className="text-ink/75 hover:text-accent"
                  >
                    {t("nav.howItWorks")}
                  </a>
                </li>
                <li>
                  <a href="#fields" className="text-ink/75 hover:text-accent">
                    {t("nav.fields")}
                  </a>
                </li>
                <li>
                  <a
                    href={APK_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink/75 hover:text-accent"
                  >
                    {t("common.getApp")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[13px] font-semibold text-ink/50">
                {t("footer.project")}
              </p>
              <ul className="mt-3 space-y-2 text-[14px]">
                <li>
                  <a
                    href={REPO_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink/75 hover:text-accent"
                  >
                    {t("footer.github")}
                  </a>
                </li>
                <li>
                  <a
                    href={`${REPO_URL}/releases`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink/75 hover:text-accent"
                  >
                    {t("footer.releases")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
