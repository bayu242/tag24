import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";
import { Button } from "../components/Button";
import { NfcStatusCard } from "../components/NfcStatusCard";
import { Screen } from "../components/Screen";
import { useLanguage } from "../i18n";
import { useNfcGuard } from "../lib/useNfcGuard";
import { useNfcStatus } from "../lib/useNfcStatus";
import { colors, fonts, shadow } from "../theme";

type FeatherName = ComponentProps<typeof Feather>["name"];

const STEPS: { icon: FeatherName; titleKey: string; bodyKey: string }[] = [
  { icon: "edit-3", titleKey: "home.step.write.title", bodyKey: "home.step.write.body" },
  { icon: "radio", titleKey: "home.step.tap.title", bodyKey: "home.step.tap.body" },
  { icon: "eye", titleKey: "home.step.read.title", bodyKey: "home.step.read.body" },
  { icon: "refresh-cw", titleKey: "home.step.edit.title", bodyKey: "home.step.edit.body" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { status, openSettings } = useNfcStatus();
  const ensureNfcActive = useNfcGuard();

  async function openWrite() {
    if (await ensureNfcActive()) router.push("/write");
  }

  async function openRead() {
    if (await ensureNfcActive()) router.push("/read");
  }

  return (
    <Screen>
      <Text
        className="text-[40px] leading-[46px] text-ink"
        style={{ fontFamily: fonts.display }}
      >
        {t("home.headline")}
      </Text>
      <Text className="mt-3 font-body text-[17px] leading-6 text-ink opacity-70">
        {t("home.subtext")}
      </Text>

      <View className="mt-7">
        <NfcStatusCard state={status} onAction={status === "disabled" ? openSettings : undefined} />
      </View>

      <View className="mt-6 gap-3">
        <Button icon="edit-3" size="lg" onPress={openWrite}>
          {t("home.writeAction")}
        </Button>
        <Button variant="secondary" size="lg" icon="eye" onPress={openRead}>
          {t("home.readAction")}
        </Button>
      </View>

      <Text
        className="mt-10 text-[26px] leading-[32px] text-ink"
        style={{ fontFamily: fonts.display }}
      >
        {t("home.howItWorks")}
      </Text>
      <View style={shadow.card} className="mt-4 rounded-lg">
        <View className="overflow-hidden rounded-lg border border-line bg-background">
          {STEPS.map((step, index) => (
            <View
              key={step.titleKey}
              className={`flex-row gap-4 px-4 py-4 ${
                index === STEPS.length - 1 ? "" : "border-b border-line"
              }`}
            >
              <View className="h-9 w-9 items-center justify-center rounded-md bg-primary-soft">
                <Feather name={step.icon} size={17} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text className="font-body-semibold text-[15px] text-ink">
                  {t(step.titleKey)}
                </Text>
                <Text className="mt-0.5 font-body text-[14px] leading-5 text-ink opacity-70">
                  {t(step.bodyKey)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-10 rounded-lg border border-line bg-primary-soft p-5">
        <Text className="font-body-semibold text-base text-ink">{t("home.supportedTag")}</Text>
        <Text className="mt-1 font-body text-[14px] leading-5 text-ink opacity-80">
          {t("home.supportedTagBody")}
        </Text>
      </View>
    </Screen>
  );
}
