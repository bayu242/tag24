import { useLanguage } from "../i18n/useLanguage";

const BASE = import.meta.env.BASE_URL;

const SCREENS = [
  {
    src: `${BASE}write.png`,
    altKey: "hero.screens.write",
    className: "left-[6%] top-[9%] z-10 w-[52%] -rotate-[6deg]",
  },
  {
    src: `${BASE}read.png`,
    altKey: "hero.screens.read",
    className: "right-[6%] top-[9%] z-10 w-[52%] rotate-[6deg]",
  },
  {
    src: `${BASE}home.png`,
    altKey: "hero.screens.home",
    className: "left-1/2 top-0 z-20 w-[58%] -translate-x-1/2",
  },
];

export function AppScreenshots() {
  const { t } = useLanguage();

  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px]">
      {SCREENS.map((screen) => (
        <div
          key={screen.src}
          className={`absolute overflow-hidden rounded-[1.75rem] border border-line bg-background shadow-card ${screen.className}`}
        >
          <img src={screen.src} alt={t(screen.altKey)} className="block w-full" />
        </div>
      ))}
    </div>
  );
}
