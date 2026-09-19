import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { useLanguage } from "../i18n";
import { colors } from "../theme";
import { Button } from "./Button";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useLanguage();
  const accent = tone === "danger" ? colors.danger : colors.accent;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        onPress={onCancel}
        className="flex-1 items-center justify-center bg-black/40 px-5"
      >
        <Pressable
          onPress={() => {}}
          className="w-full max-w-[420px] items-center rounded-lg bg-background px-6 py-6"
        >
          <View
            className="h-14 w-14 items-center justify-center rounded-xl"
            style={{ backgroundColor: tone === "danger" ? "#fbecea" : colors.accentSoft }}
          >
            <Feather
              name={tone === "danger" ? "trash-2" : "alert-triangle"}
              size={24}
              color={accent}
            />
          </View>

          <Text className="mt-4 text-center font-body-semibold text-lg text-ink">{title}</Text>
          <Text className="mt-2 text-center font-body text-[15px] leading-6 text-ink opacity-70">
            {message}
          </Text>

          <View className="mt-6 w-full gap-2">
            <Button variant={tone === "danger" ? "danger" : "primary"} onPress={onConfirm}>
              {confirmLabel ?? t("common.confirm")}
            </Button>
            <Button variant="secondary" onPress={onCancel}>
              {cancelLabel ?? t("common.cancel")}
            </Button>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
