import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useLanguage } from "../i18n";
import { colors } from "../theme";
import { FieldInput } from "./FieldInput";

type MultiFieldInputProps = {
  label: string;
  values: string[];
  measuredValues: string[];
  errors?: (string | undefined)[];
  placeholder: string;
  maxChar: number;
  onChangeText: (index: number, value: string) => void;
  onAdd: () => void;
  onRemoveRow: (index: number) => void;
  onRemoveField: () => void;
  onFocus?: () => void;
};

export function MultiFieldInput({
  label,
  values,
  measuredValues,
  errors,
  placeholder,
  maxChar,
  onChangeText,
  onAdd,
  onRemoveRow,
  onRemoveField,
  onFocus,
}: MultiFieldInputProps) {
  const { t } = useLanguage();

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="font-body-medium text-[15px] text-ink">{label}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("field.remove", { name: label })}
          hitSlop={10}
          onPress={onRemoveField}
          style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
        >
          <Feather name="x" size={18} color={colors.danger} />
        </Pressable>
      </View>

      {values.map((value, index) => (
        <FieldInput
          key={index}
          value={value}
          measuredValue={measuredValues[index]}
          error={errors?.[index]}
          showCount={false}
          onChangeText={(next) => onChangeText(index, next)}
          maxChar={maxChar}
          placeholder={placeholder}
          autoCapitalize="none"
          onRemove={values.length > 1 ? () => onRemoveRow(index) : undefined}
          onFocus={onFocus}
        />
      ))}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("write.addAnother")}
        onPress={onAdd}
        style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
        className="flex-row items-center gap-1.5 self-start rounded-md border border-line px-3 py-2"
      >
        <Feather name="plus" size={16} color={colors.accent} />
        <Text className="font-body-medium text-[14px]" style={{ color: colors.accent }}>
          {t("write.addAnother")}
        </Text>
      </Pressable>
    </View>
  );
}
