import { Feather } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { colors } from "../theme";

type FeatherName = ComponentProps<typeof Feather>["name"];
type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const CONTAINER: Record<Variant, string> = {
  primary: "bg-primary border border-primary",
  accent: "bg-accent border border-accent",
  secondary: "bg-background border border-line",
  ghost: "bg-transparent border border-transparent",
  danger: "bg-danger border border-danger",
};

const LABEL: Record<Variant, string> = {
  primary: "text-on-primary",
  accent: "text-on-primary",
  secondary: "text-ink",
  ghost: "text-accent",
  danger: "text-on-primary",
};

const ICON_COLOR: Record<Variant, string> = {
  primary: colors.onPrimary,
  accent: colors.onPrimary,
  secondary: colors.ink,
  ghost: colors.accent,
  danger: colors.onPrimary,
};

// sm is 44px to satisfy the minimum touch target; md/lg scale up from there.
const HEIGHT: Record<Size, string> = {
  sm: "h-11",
  md: "h-12",
  lg: "h-14",
};

const LABEL_SIZE: Record<Size, string> = {
  sm: "text-[15px]",
  md: "text-base",
  lg: "text-[17px]",
};

const ICON_SIZE: Record<Size, number> = {
  sm: 16,
  md: 18,
  lg: 20,
};

type ButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: FeatherName;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
};

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  disabled = false,
  fullWidth = true,
  className = "",
}: ButtonProps) {
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => (pressed ? { opacity: 0.85, transform: [{ scale: 0.99 }] } : undefined)}
      className={`flex-row items-center justify-center gap-2 rounded-md px-5 ${
        HEIGHT[size]
      } ${CONTAINER[variant]} ${fullWidth ? "w-full" : ""} ${
        inactive ? "opacity-50" : ""
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={ICON_COLOR[variant]} size="small" />
      ) : icon ? (
        <Feather name={icon} size={ICON_SIZE[size]} color={ICON_COLOR[variant]} />
      ) : null}
      <Text
        numberOfLines={1}
        className={`font-body-semibold ${LABEL_SIZE[size]} ${LABEL[variant]}`}
      >
        {children}
      </Text>
    </Pressable>
  );
}
