import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import type { TagDataType } from "tag";
import { useLanguage } from "../i18n";
import { colors } from "../theme";
import { Button } from "./Button";

type AddFieldModalProps = {
  visible: boolean;
  available: TagDataType[];
  onClose: () => void;
  onAdd: (ids: string[]) => void;
};

export function AddFieldModal({ visible, available, onClose, onAdd }: AddFieldModalProps) {
  const { t } = useLanguage();
  const [pending, setPending] = useState<string[]>([]);

  function toggle(id: string) {
    setPending((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function handleClose() {
    setPending([]);
    onClose();
  }

  function confirm() {
    if (pending.length === 0) return;
    onAdd(pending);
    handleClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable
        onPress={handleClose}
        className="flex-1 items-center justify-center bg-black/40 px-5"
      >
        <Pressable
          onPress={() => {}}
          className="w-full max-w-[420px] overflow-hidden rounded-lg bg-background"
        >
          <View className="flex-row items-start justify-between px-5 pt-5">
            <View className="flex-1 pr-3">
              <Text className="font-body-semibold text-lg text-ink">{t("addField.title")}</Text>
              <Text className="mt-1 font-body text-[13px] leading-5 text-ink opacity-70">
                {t("addField.subtitle")}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("common.close")}
              hitSlop={10}
              onPress={handleClose}
              style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
            >
              <Feather name="x" size={22} color={colors.ink} />
            </Pressable>
          </View>

          {available.length === 0 ? (
            <View className="items-center px-5 py-10">
              <Feather name="check-circle" size={26} color={colors.success} />
              <Text className="mt-3 font-body text-[14px] text-ink opacity-70">
                {t("addField.empty")}
              </Text>
            </View>
          ) : (
            <ScrollView className="mt-4 max-h-[380px]" showsVerticalScrollIndicator={false}>
              {available.map((type, index) => {
                const checked = pending.includes(type.id);
                return (
                  <Pressable
                    key={type.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                    onPress={() => toggle(type.id)}
                    style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
                    className={`flex-row items-center gap-3 px-5 py-3.5 ${
                      index === 0 ? "" : "border-t border-line"
                    }`}
                  >
                    <View
                      className={`h-6 w-6 items-center justify-center rounded-sm border ${
                        checked ? "border-accent bg-accent" : "border-line"
                      }`}
                    >
                      {checked ? (
                        <Feather name="check" size={14} color={colors.onPrimary} />
                      ) : null}
                    </View>
                    <View className="flex-1">
                      <Text className="font-body-medium text-[15px] text-ink">
                        {t(`field.${type.id}`, undefined, type.name)}
                      </Text>
                      <Text className="font-body text-[12px] text-ink opacity-60">
                        {t("field.maxCharHint", { count: type.maxChar })}
                      </Text>
                    </View>
                    {type.linkTemplate ? (
                      <Feather name="link-2" size={15} color={colors.accent} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <View className="gap-2 border-t border-line px-5 py-4">
            <Button disabled={pending.length === 0} onPress={confirm}>
              {pending.length > 0
                ? t("addField.addCount", { count: pending.length })
                : t("addField.add")}
            </Button>
            <Button variant="secondary" onPress={handleClose}>
              {t("common.cancel")}
            </Button>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
