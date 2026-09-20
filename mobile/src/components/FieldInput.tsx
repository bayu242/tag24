import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import type { KeyboardTypeOptions } from "react-native";
import { Pressable, Text, TextInput, View } from "react-native";
import { useLanguage } from "../i18n";
import { colors } from "../theme";

type FieldInputProps = {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  maxChar: number;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
  /** Value used for the length counter and maxChar check (e.g. the normalized
   * username/ID when the field shows a pasted link). Defaults to `value`. */
  measuredValue?: string;
  /** Show the character counter and maxChar warning. Spotify fields hide it
   * because maxChar is a system limit there, not a field limit. */
  showCount?: boolean;
  onRemove?: () => void;
  onFocus?: () => void;
};

export function FieldInput({
  label,
  value,
  onChangeText,
  maxChar,
  placeholder,
  multiline = false,
  keyboardType,
  autoCapitalize = "sentences",
  error,
  measuredValue,
  showCount = true,
  onRemove,
  onFocus,
}: FieldInputProps) {
  const [focused, setFocused] = useState(false);
  const { t } = useLanguage();
  const measured = measuredValue ?? value;
  const over = showCount && measured.length > maxChar;
  const showError = Boolean(error) || over;
  const message =
    error ??
    (over ? t("field.tooLong", { count: measured.length - maxChar }) : undefined);

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        {label ? (
          <Text className="font-body-medium text-[15px] text-ink">{label}</Text>
        ) : (
          <View />
        )}
        <View className="flex-row items-center gap-3">
          {showCount ? (
            <Text
              className="font-body text-[13px]"
              style={{ color: over ? colors.danger : colors.ink, opacity: over ? 1 : 0.5 }}
            >
              {measured.length}/{maxChar}
            </Text>
          ) : null}
          {onRemove ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={label ? t("field.remove", { name: label }) : undefined}
              hitSlop={10}
              onPress={onRemove}
              style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
            >
              <Feather name="x" size={18} color={colors.danger} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#6b6b6b"
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        returnKeyType={multiline ? "default" : "done"}
        blurOnSubmit={!multiline}
        className={`rounded-md border bg-background px-4 py-3 font-body text-base text-ink ${
          multiline ? "min-h-[96px]" : ""
        }`}
        style={{
          borderColor: showError ? colors.danger : focused ? colors.primary : colors.line,
          borderWidth: focused && !showError ? 2 : 1,
          textAlignVertical: multiline ? "top" : "center",
        }}
      />

      {message ? (
        <Text className="font-body text-[13px]" style={{ color: colors.danger }}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}
