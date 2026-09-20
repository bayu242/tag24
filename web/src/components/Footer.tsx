import { useLanguage } from "../i18n/useLanguage";
import { REPO_URL } from "../lib/site";
import logo from "../assets/logo.png";
import githubIcon from "../assets/icons/github.svg";
import { Container } from "./Container";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-line py-14">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-[38ch]">
            <span className="flex items-center gap-2">
              <img src={logo} alt="" className="h-8 w-auto" />
              <span className="font-display text-[22px] leading-none">Tag24</span>
            </span>
            <p className="mt-3 text-[14px] leading-6 text-ink/60">
              {t("footer.description")}
            </p>
          </div>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[14px] text-ink/75 hover:text-accent"
          >
            <img src={githubIcon} alt="" className="h-5 w-5" />
            {t("footer.github")}
          </a>
        </div>
      </Container>
    </footer>
  );
}
