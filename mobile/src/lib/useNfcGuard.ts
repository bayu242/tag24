import { useCallback } from "react";
import { Alert } from "react-native";
import { useLanguage } from "../i18n";
import { getNfcAvailability, openNfcSettings } from "./nfc";

/**
 * Returns a guard that checks NFC state before an operation. When NFC is off or
 * unsupported it shows an alert and resolves to false, so callers can abort.
 */
export function useNfcGuard() {
  const { t } = useLanguage();

  return useCallback(async (): Promise<boolean> => {
    const availability = await getNfcAvailability();
    if (availability === "ready") return true;

    if (availability === "disabled") {
      Alert.alert(t("nfc.disabled.title"), t("nfc.disabled.message"), [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("nfc.alert.openSettings"),
          onPress: () => {
            void openNfcSettings();
          },
        },
      ]);
    } else {
      Alert.alert(t("nfc.unsupported.title"), t("nfc.unsupported.message"), [
        { text: t("common.close"), style: "cancel" },
      ]);
    }

    return false;
  }, [t]);
}
