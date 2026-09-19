import { Feather } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { colors } from "../theme";

type FeatherName = ComponentProps<typeof Feather>["name"];
type Tone = "empty" | "loading" | "error" | "success";

const CONFIG: Record<Exclude<Tone, "loading">, { icon: FeatherName; color: string }> = {
  empty: { icon: "inbox", color: colors.accent },
  error: { icon: "alert-triangle", color: colors.danger },
  success: { icon: "check-circle", color: colors.success },
};

type StatePanelProps = {
  tone: Tone;
  title: string;
  message?: string;
  action?: ReactNode;
};

export function StatePanel({ tone, title, message, action }: StatePanelProps) {
  return (
    <View className="items-center justify-center rounded-lg border border-line bg-background px-6 py-12">
      {tone === "loading" ? (
        <ActivityIndicator color={colors.primary} size="large" />
      ) : (
        <View className="h-14 w-14 items-center justify-center rounded-xl bg-accent-soft">
          <Feather name={CONFIG[tone].icon} size={26} color={CONFIG[tone].color} />
        </View>
      )}
      <Text className="mt-4 text-center font-body-semibold text-lg text-ink">{title}</Text>
      {message ? (
        <Text className="mt-2 max-w-[36ch] text-center font-body text-[15px] leading-6 text-ink opacity-70">
          {message}
        </Text>
      ) : null}
      {action ? <View className="mt-6 w-full">{action}</View> : null}
    </View>
  );
}
