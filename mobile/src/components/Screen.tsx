import { useEffect, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
  floating?: ReactNode;
  footer?: ReactNode;
  scrollRef?: RefObject<ScrollView | null>;
  onViewportChange?: (height: number) => void;
};

export function Screen({
  children,
  scroll = true,
  className = "",
  floating,
  footer,
  scrollRef,
  onViewportChange,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const basePadding = floating ? 112 : 48;
  // Extra bottom room while the keyboard is open so the last fields can still
  // be scrolled above it instead of being covered.
  const contentPaddingBottom = basePadding + keyboardHeight;

  const body = <View className={`flex-1 bg-background px-5 pt-4 ${className}`}>{children}</View>;

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 44 : 0}
      >
        {scroll ? (
          <ScrollView
            ref={scrollRef}
            className="flex-1"
            contentContainerClassName="grow"
            contentContainerStyle={{ paddingBottom: contentPaddingBottom }}
            onLayout={(event) => onViewportChange?.(event.nativeEvent.layout.height)}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          >
            {body}
          </ScrollView>
        ) : (
          body
        )}

        {floating ? (
          <View className="absolute right-5" style={{ bottom: footer ? 104 : 24 }}>
            {floating}
          </View>
        ) : null}

        {footer ? (
          <View className="border-t border-line bg-background px-5 py-4">{footer}</View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
