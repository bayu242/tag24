import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import type { TagData } from "tag";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { StatePanel } from "../components/StatePanel";
import { TagFieldList } from "../components/TagFieldList";
import { useLanguage } from "../i18n";
import type { NfcError } from "../lib/nfc";
import { readNfcTag } from "../lib/nfc";
import { useNfcGuard } from "../lib/useNfcGuard";
import { fonts } from "../theme";

type Step = "idle" | "reading" | "success" | "error";

export default function ReadScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const ensureNfcActive = useNfcGuard();
  const [step, setStep] = useState<Step>("idle");
  const [data, setData] = useState<TagData | null>(null);
  const [readError, setReadError] = useState<NfcError | null>(null);

  useEffect(() => {
    if (step !== "reading") return;
    let active = true;

    async function run() {
      const result = await readNfcTag();
      if (!active) return;
      if (result.ok) {
        setData(result.value.data);
        setStep("success");
      } else {
        setReadError(result.error);
        setStep("error");
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [step]);

  async function startReading() {
    if (!(await ensureNfcActive())) return;
    setReadError(null);
    setStep("reading");
  }

  if (step === "reading") {
    return (
      <Screen scroll={false} className="justify-center">
        <StatePanel
          tone="loading"
          title={t("read.reading.title")}
          message={t("read.reading.message")}
        />
      </Screen>
    );
  }

  if (step === "error") {
    return (
      <Screen scroll={false} className="justify-center">
        <StatePanel
          tone="error"
          title={t("read.error.title")}
          message={
            readError
              ? t(`error.${readError.code}`, undefined, readError.message)
              : t("read.error.message")
          }
          action={<Button onPress={() => setStep("idle")}>{t("common.tryAgain")}</Button>}
        />
      </Screen>
    );
  }

  if (step === "success") {
    const tagData = data ?? {};
    const fieldCount = Object.keys(tagData).length;
    const listData = Object.fromEntries(
      Object.entries(tagData).filter(([id]) => id !== "nm"),
    );
    return (
      <Screen>
        <Text className="text-[32px] leading-[38px] text-ink" style={{ fontFamily: fonts.display }}>
          {tagData.nm ?? t("read.success.nameFallback")}
        </Text>
        <Text className="mt-2 font-body text-[15px] text-ink opacity-70">
          {t("read.success.fields", { count: fieldCount })}
        </Text>

        <View className="mt-6">
          <TagFieldList data={listData} />
        </View>

        <View className="mt-8 gap-3">
          <Button
            size="lg"
            icon="edit-3"
            onPress={() =>
              router.push({
                pathname: "/write",
                params: { data: JSON.stringify(tagData) },
              })
            }
          >
            {t("read.success.edit")}
          </Button>
          <Button variant="secondary" size="lg" onPress={() => setStep("idle")}>
            {t("read.success.readAnother")}
          </Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false} className="justify-center">
      <StatePanel
        tone="empty"
        title={t("read.idle.title")}
        message={t("read.idle.message")}
        action={
          <Button size="lg" icon="radio" onPress={startReading}>
            {t("read.idle.start")}
          </Button>
        }
      />
    </Screen>
  );
}
