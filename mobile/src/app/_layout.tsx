import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../../global.css";
import { LanguageButton } from "../components/LanguageButton";
import { LanguageProvider, useLanguage } from "../i18n";
import { colors } from "../theme";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <RootNavigator />
    </LanguageProvider>
  );
}

function RootNavigator() {
  const { t } = useLanguage();
  const [loaded, error] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  if (!loaded && !error) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.accent,
          headerTitleStyle: {
            fontFamily: "DMSans_600SemiBold",
            fontSize: 18,
            color: colors.ink,
          },
          headerShadowVisible: false,
          headerRight: () => <LanguageButton />,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: t("app.name") }} />
        <Stack.Screen name="write" options={{ title: t("nav.write") }} />
        <Stack.Screen name="read" options={{ title: t("nav.read") }} />
      </Stack>
    </>
  );
}
