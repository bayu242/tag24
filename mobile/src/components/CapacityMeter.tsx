import { Text, View } from "react-native";
import { useLanguage } from "../i18n";
import { capacityLevel } from "../lib/config";
import { colors } from "../theme";

type CapacityMeterProps = {
  size: number;
  capacity: number;
};

const MESSAGE_KEY = {
  ok: "capacity.ok",
  tight: "capacity.tight",
  over: "capacity.over",
} as const;

export function CapacityMeter({ size, capacity }: CapacityMeterProps) {
  const { t } = useLanguage();
  const level = capacityLevel(size, capacity);
  const usedRatio = size / capacity;
  const barRatio = Math.min(usedRatio, 1);
  const color =
    level === "over" ? colors.danger : level === "tight" ? colors.warning : colors.success;

  return (
    <View className="rounded-lg border border-line bg-background p-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-body-medium text-[15px] text-ink">{t("capacity.title")}</Text>
        <Text className="font-body-semibold text-[15px]" style={{ color }}>
          {Math.round(usedRatio * 100)}%
        </Text>
      </View>
      <View className="mt-3 h-2 w-full overflow-hidden rounded-sm bg-line">
        <View
          className="h-full rounded-sm"
          style={{ width: `${barRatio * 100}%`, backgroundColor: color }}
        />
      </View>
      <Text className="mt-2 font-body text-[13px] leading-5 text-ink opacity-70">
        {t(MESSAGE_KEY[level])}
      </Text>
    </View>
  );
}
