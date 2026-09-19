import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useLanguage } from "../i18n";
import { LANGUAGES } from "../i18n/translations";
import { colors } from "../theme";
import { Button } from "./Button";

export function LanguageButton() {
  const { language, setLanguage, t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const current = LANGUAGES.find((option) => option.code === language);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t("language.title")}: ${current?.label ?? language}`}
        hitSlop={12}
        onPress={() => setVisible(true)}
        style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
        className="flex-row items-center gap-1.5 p-1"
      >
        <Feather name="globe" size={20} color={colors.accent} />
        <Text className="font-body-semibold text-[13px] text-accent">
          {current?.short ?? language.toUpperCase()}
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          onPress={() => setVisible(false)}
          className="flex-1 items-center justify-center bg-black/40 px-5"
        >
          <Pressable
            onPress={() => {}}
            className="w-full max-w-[420px] overflow-hidden rounded-lg bg-background"
          >
            <Text className="px-5 pt-5 font-body-semibold text-lg text-ink">
              {t("language.title")}
            </Text>

            <View className="mt-4">
              {LANGUAGES.map((option, index) => {
                const active = option.code === language;
                return (
                  <Pressable
                    key={option.code}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    onPress={() => {
                      setLanguage(option.code);
                      setVisible(false);
                    }}
                    style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
                    className={`flex-row items-center justify-between px-5 py-4 ${
                      index === 0 ? "" : "border-t border-line"
                    }`}
                  >
                    <Text className="font-body-medium text-[15px] text-ink">{option.label}</Text>
                    {active ? <Feather name="check" size={18} color={colors.accent} /> : null}
                  </Pressable>
                );
              })}
            </View>

            <View className="px-5 py-4">
              <Button variant="secondary" onPress={() => setVisible(false)}>
                {t("common.close")}
              </Button>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
