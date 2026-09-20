import { Feather } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { useLanguage } from "../i18n";
import type { NfcState } from "../theme";
import { colors, shadow } from "../theme";

type FeatherName = ComponentProps<typeof Feather>["name"];

const CONFIG: Record<
  NfcState,
  { icon: FeatherName; color: string; tint: string; titleKey: string; messageKey: string }
> = {
  ready: {
    icon: "radio",
    color: colors.success,
    tint: colors.successSoft,
    titleKey: "nfc.ready.title",
    messageKey: "nfc.ready.message",
  },
  disabled: {
    icon: "wifi-off",
    color: colors.warning,
    tint: colors.warningSoft,
    titleKey: "nfc.disabled.title",
    messageKey: "nfc.disabled.message",
  },
  unsupported: {
    icon: "slash",
    color: colors.danger,
    tint: colors.dangerSoft,
    titleKey: "nfc.unsupported.title",
    messageKey: "nfc.unsupported.message",
  },
};

type NfcStatusCardProps = {
  state: NfcState;
  onAction?: () => void;
};

export function NfcStatusCard({ state, onAction }: NfcStatusCardProps) {
  const { t } = useLanguage();
  const config = CONFIG[state];

  return (
    <View
      style={shadow.card}
      className="flex-row items-center gap-4 rounded-lg border border-line bg-background p-4"
    >
      <View
        className="h-11 w-11 items-center justify-center rounded-md"
        style={{ backgroundColor: config.tint }}
      >
        <Feather name={config.icon} size={20} color={config.color} />
      </View>
      <View className="flex-1">
        <Text className="font-body-semibold text-base text-ink">{t(config.titleKey)}</Text>
        <Text className="mt-0.5 font-body text-sm text-ink" style={{ opacity: 0.7 }}>
          {t(config.messageKey)}
        </Text>
        {onAction ? (
          <Pressable
            accessibilityRole="button"
            onPress={onAction}
            hitSlop={8}
            style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
            className="mt-2 self-start"
          >
            <Text className="font-body-semibold text-[14px] text-accent">{t("nfc.enable")}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
