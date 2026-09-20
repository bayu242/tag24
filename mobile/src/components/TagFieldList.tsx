import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Linking, Pressable, Text, View } from "react-native";
import type { TagData } from "tag";
import {
  buildTagLinkById,
  compositeValue,
  hasTagValue,
  initialTagDataTypes,
  tagValues,
} from "tag";
import { useLanguage } from "../i18n";
import { getFieldIcon } from "../lib/fieldIcons";
import { colors, shadow } from "../theme";

type TagFieldListProps = {
  data: TagData;
};

export function TagFieldList({ data }: TagFieldListProps) {
  const { t } = useLanguage();
  const entries = initialTagDataTypes.filter((type) => hasTagValue(data[type.id]));

  if (entries.length === 0) return null;

  return (
    <View style={shadow.card} className="rounded-lg">
      <View className="overflow-hidden rounded-lg border border-line bg-background">
        {entries.map((type, index) => {
          const values = tagValues(data[type.id]);
          const composite = compositeValue(data[type.id]);
          const isLast = index === entries.length - 1;
          const label = t(`field.${type.id}`, undefined, type.name);
          const icon = getFieldIcon(type.id);

          return (
            <View
              key={type.id}
              className={`px-4 py-4 ${isLast ? "" : "border-b border-line"}`}
            >
              <View className="flex-row items-center gap-1.5">
                {icon ? (
                  <Image source={icon} style={{ width: 16, height: 16 }} contentFit="contain" />
                ) : null}
                <Text
                  className="font-body text-[12px] uppercase"
                  style={{ color: colors.accent, letterSpacing: 0.6, opacity: 0.75 }}
                >
                  {label}
                </Text>
              </View>
              <View className="mt-1 gap-2">
                {composite
                  ? (type.fields ?? []).map((sub) => {
                      const value = composite[sub.id];
                      if (!value) return null;
                      return (
                        <View
                          key={sub.id}
                          className="flex-row items-center justify-between gap-3"
                        >
                          <Text
                            className="font-body text-[12px] uppercase"
                            style={{ color: colors.accent, letterSpacing: 0.6, opacity: 0.75 }}
                          >
                            {t(`field.${type.id}.${sub.id}`, undefined, sub.name)}
                          </Text>
                          <Text className="font-body-medium text-base text-ink">{value}</Text>
                        </View>
                      );
                    })
                  : values.map((value, position) => {
                      const href = buildTagLinkById(type.id, value);
                      return href ? (
                        <Pressable
                          key={position}
                          accessibilityRole="link"
                          accessibilityLabel={`${label}: ${value}`}
                          onPress={() => Linking.openURL(href)}
                          style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
                          className="flex-row items-center gap-1.5"
                        >
                          <Text className="font-body-medium text-base text-accent">{value}</Text>
                          <Feather name="external-link" size={15} color={colors.accent} />
                        </Pressable>
                      ) : (
                        <Text key={position} className="font-body-medium text-base text-ink">
                          {value}
                        </Text>
                      );
                    })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
