import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import type { TagData, TagParseError } from "tag";
import { decodePayload } from "tag";
import { Button } from "../components/Button";
import { useLanguage } from "../i18n/useLanguage";
import { APK_URL } from "../lib/site";
import { StatusCard } from "./StatusCard";
import { TagResult } from "./TagResult";

type ParserState =
  | { status: "loading" }
  | { status: "success"; data: TagData }
  | { status: "error"; error: TagParseError };

export function ParserPage({ encoded }: { encoded: string }) {
  const { t } = useLanguage();
  const [state, setState] = useState<ParserState>({ status: "loading" });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const result = decodePayload(encoded);
      setState(
        result.ok
          ? { status: "success", data: result.value.data }
          : { status: "error", error: result.error },
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, [encoded]);

  return (
    <div className="min-h-[100dvh] bg-background">
      <main className="mx-auto w-full max-w-[640px] px-5 py-12 md:py-16">
        {state.status === "loading" ? (
          <StatusCard
            tone="loading"
            title={t("parser.loading.title")}
            message={t("parser.loading.message")}
          />
        ) : null}

        {state.status === "error" ? (
          <StatusCard
            tone="error"
            title={t("parser.error.title")}
            message={t(`error.${state.error.code}`, undefined, state.error.message)}
            action={
              <Button href="./" variant="secondary">
                {t("parser.home")}
              </Button>
            }
          />
        ) : null}

        {state.status === "success" ? (
          <>
            <TagResult data={state.data} />
            <div className="mt-10 text-center">
              <p className="text-[15px] text-ink/70">{t("parser.appCta")}</p>
              <div className="mt-4 flex justify-center">
                <Button href={APK_URL} external variant="accent" icon={<Download size={16} />}>
                  {t("common.getApp")}
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
