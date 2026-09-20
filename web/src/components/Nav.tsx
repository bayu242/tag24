import { useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { APK_URL, NAV_LINKS } from "../lib/site";
import logo from "../assets/logo.png";
import { Button } from "./Button";
import { Container } from "./Container";
import { LanguageSwitch } from "./LanguageSwitch";

export function Nav() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between md:h-[72px]">
          <a href="./" className="flex items-center gap-2 text-ink">
            <img src={logo} alt="" className="h-8 w-auto" />
            <span className="font-display text-[22px] leading-none">Tag24</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] text-ink/75 transition-colors duration-200 ease-brand hover:text-accent"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <div className="hidden md:block">
              <Button href={APK_URL} external variant="accent" icon={<Download size={16} />}>
                {t("common.getApp")}
              </Button>
            </div>
            <button
              type="button"
              aria-label={t("nav.menu")}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-line bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-[15px] text-ink hover:bg-accent-soft"
              >
                {t(link.key)}
              </a>
            ))}
            <Button
              href={APK_URL}
              external
              variant="accent"
              className="mt-2"
              icon={<Download size={16} />}
              onClick={() => setOpen(false)}
            >
              {t("common.getApp")}
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
