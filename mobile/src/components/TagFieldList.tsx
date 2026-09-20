import { Feather } from "@expo/vector-icons";
import { Linking, Pressable, Text, View } from "react-native";
import type { TagData } from "tag";
import { buildTagLinkById, initialTagDataTypes } from "tag";
import { useLanguage } from "../i18n";
import { colors, shadow } from "../theme";

type TagFieldListProps = {
  data: TagData;
};

export function TagFieldList({ data }: TagFieldListProps) {
  const { t } = useLanguage();
  const entries = initialTagDataTypes.filter((type) => (data[type.id] ?? "").length > 0);

  if (entries.length === 0) return null;

  return (
    <View style={shadow.card} className="rounded-lg">
      <View className="overflow-hidden rounded-lg border border-line bg-background">
        {entries.map((type, index) => {
          const value = data[type.id];
          const href = buildTagLinkById(type.id, value);
          const isLast = index === entries.length - 1;
          const label = t(`field.${type.id}`, undefined, type.name);

          return (
            <View
              key={type.id}
              className={`px-4 py-4 ${isLast ? "" : "border-b border-line"}`}
            >
              <Text
                className="font-body text-[12px] uppercase"
                style={{ color: colors.accent, letterSpacing: 0.6, opacity: 0.75 }}
              >
                {label}
              </Text>
              {href ? (
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel={`${label}: ${value}`}
                  onPress={() => Linking.openURL(href)}
                  style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
                  className="mt-1 flex-row items-center gap-1.5"
                >
                  <Text className="font-body-medium text-base text-accent">{value}</Text>
                  <Feather name="external-link" size={15} color={colors.accent} />
                </Pressable>
              ) : (
                <Text className="mt-1 font-body-medium text-base text-ink">{value}</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
