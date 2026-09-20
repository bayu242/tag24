import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { TagSubField } from "tag";
import { useLanguage } from "../i18n";
import { colors } from "../theme";
import { FieldInput } from "./FieldInput";

type CompositeFieldInputProps = {
  label: string;
  fields: TagSubField[];
  values: Record<string, string>;
  errors?: Record<string, string | undefined>;
  labelFor: (sub: TagSubField) => string;
  placeholderFor: (sub: TagSubField) => string;
  onChange: (subId: string, value: string) => void;
  onRemoveField: () => void;
  onFocus?: () => void;
};

export function CompositeFieldInput({
  label,
  fields,
  values,
  errors,
  labelFor,
  placeholderFor,
  onChange,
  onRemoveField,
  onFocus,
}: CompositeFieldInputProps) {
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

      {fields.map((sub) => (
        <FieldInput
          key={sub.id}
          label={labelFor(sub)}
          value={values[sub.id] ?? ""}
          error={errors?.[sub.id]}
          onChangeText={(value) => onChange(sub.id, value)}
          maxChar={sub.maxChar}
          placeholder={placeholderFor(sub)}
          autoCapitalize="none"
          onFocus={onFocus}
        />
      ))}
    </View>
  );
}
