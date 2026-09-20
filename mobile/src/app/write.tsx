import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Alert, Keyboard, Pressable, Text, View } from "react-native";
import type { KeyboardTypeOptions, ScrollView } from "react-native";
import type { TagData, TagDataType } from "tag";
import {
  estimateTagSize,
  getTagDataType,
  initialTagDataTypes,
  isSocialField,
  isSpotifyField,
  normalizeFieldValue,
  tagValues,
  validateFieldValue,
  validateTagData,
} from "tag";
import { AddFieldModal } from "../components/AddFieldModal";
import { Button } from "../components/Button";
import { CapacityMeter } from "../components/CapacityMeter";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FieldInput } from "../components/FieldInput";
import { MultiFieldInput } from "../components/MultiFieldInput";
import { Screen } from "../components/Screen";
import { StatePanel } from "../components/StatePanel";
import { useLanguage } from "../i18n";
import type { NfcError } from "../lib/nfc";
import { writeNfcTag } from "../lib/nfc";
import { PARSER_URL, TAG_CAPACITY_BYTES } from "../lib/config";
import { useNfcGuard } from "../lib/useNfcGuard";
import { colors, fonts, shadow } from "../theme";

type Step = "form" | "writing" | "success" | "error";

type InputOptions = {
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
};

function inputOptionsFor(type: TagDataType): InputOptions {
  if (type.id === "em") return { keyboardType: "email-address", autoCapitalize: "none" };
  if (type.id === "ph" || type.id === "wa") return { keyboardType: "phone-pad" };
  if (type.id === "ad" || type.id === "nt") return { multiline: true };
  return { autoCapitalize: "none" };
}

function parseTagDataParam(value?: string): TagData {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const data: TagData = {};
      for (const [id, entry] of Object.entries(parsed as Record<string, unknown>)) {
        if (typeof entry === "string") {
          data[id] = entry;
        } else if (Array.isArray(entry) && entry.every((item) => typeof item === "string")) {
          data[id] = entry;
        }
      }
      return data;
    }
  } catch {
    // Ignore malformed params and fall back to an empty tag.
  }
  return {};
}

export default function WriteScreen() {
  const params = useLocalSearchParams<{ data?: string }>();
  const { t } = useLanguage();
  const ensureNfcActive = useNfcGuard();

  const initialData = useMemo(() => parseTagDataParam(params.data), [params.data]);

  const [step, setStep] = useState<Step>("form");
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [writeError, setWriteError] = useState<NfcError | null>(null);
  const [selected, setSelected] = useState<string[]>(() => Object.keys(initialData));
  const [values, setValues] = useState<Record<string, string>>(() => {
    const result: Record<string, string> = {};
    for (const [id, entry] of Object.entries(initialData)) {
      if (getTagDataType(id)?.multi) continue;
      const [first] = tagValues(entry);
      if (first !== undefined) result[id] = first;
    }
    return result;
  });
  const [multiValues, setMultiValues] = useState<Record<string, string[]>>(() => {
    const result: Record<string, string[]> = {};
    for (const [id, entry] of Object.entries(initialData)) {
      if (!getTagDataType(id)?.multi) continue;
      result[id] = tagValues(entry);
    }
    return result;
  });

  const scrollRef = useRef<ScrollView>(null);
  const fieldsTop = useRef(0);
  const fieldOffsets = useRef<Record<string, number>>({});
  const fieldHeights = useRef<Record<string, number>>({});
  const viewportHeight = useRef(0);
  const focusedId = useRef<string | null>(null);

  const focusField = useCallback((id: string) => {
    focusedId.current = id;
    const y = fieldsTop.current + (fieldOffsets.current[id] ?? 0);
    const height = fieldHeights.current[id] ?? 0;
    // Center the field within the visible area (which already shrinks when the
    // keyboard is open), instead of pinning it to the top.
    const viewport = viewportHeight.current;
    const centerOffset = viewport > 0 ? Math.max((viewport - height) / 2, 0) : 0;
    const target = Math.max(y - centerOffset, 0);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: target, animated: true });
    });
  }, []);

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidShow", () => {
      const id = focusedId.current;
      if (!id) return;
      // Delay so the keyboard-height bottom padding is laid out first, giving
      // the field enough room to scroll above the keyboard.
      setTimeout(() => focusField(id), 250);
    });
    return () => subscription.remove();
  }, [focusField]);

  const selectedTypes = useMemo(
    () => initialTagDataTypes.filter((type) => selected.includes(type.id)),
    [selected],
  );
  const availableTypes = useMemo(
    () => initialTagDataTypes.filter((type) => !selected.includes(type.id)),
    [selected],
  );

  const selectedValues = useMemo(() => {
    const result: TagData = {};
    for (const type of initialTagDataTypes) {
      if (!selected.includes(type.id)) continue;
      if (type.multi) {
        const entries = (multiValues[type.id] ?? []).map((entry) => entry.trim()).filter(Boolean);
        if (entries.length > 0) result[type.id] = entries;
      } else if (values[type.id]?.trim()) {
        result[type.id] = values[type.id].trim();
      }
    }
    return result;
  }, [selected, values, multiValues]);

  const estimate = useMemo(
    () => estimateTagSize(PARSER_URL, selectedValues),
    [selectedValues],
  );
  const size = estimate.ndefBytes;

  useEffect(() => {
    if (step !== "writing") return;
    let active = true;

    async function run() {
      const result = await writeNfcTag(estimate.parserUrl);
      if (!active) return;
      if (result.ok) {
        setStep("success");
      } else {
        setWriteError(result.error);
        setStep("error");
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [step, estimate.parserUrl]);

  const validation = useMemo(() => validateTagData(selectedValues), [selectedValues]);
  const canWrite = selected.length > 0 && validation.ok;
  const pendingRemoveType = pendingRemoveId
    ? initialTagDataTypes.find((type) => type.id === pendingRemoveId)
    : undefined;

  function addFields(ids: string[]) {
    setSelected((current) => [...current, ...ids.filter((id) => !current.includes(id))]);
    setMultiValues((current) => {
      const next = { ...current };
      for (const id of ids) {
        if (getTagDataType(id)?.multi && !next[id]) next[id] = [""];
      }
      return next;
    });
  }

  function removeField(id: string) {
    setSelected((current) => current.filter((item) => item !== id));
    setValues((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setMultiValues((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function setValue(id: string, value: string) {
    // Keep exactly what the user typed or pasted. Social/Spotify links are
    // reduced to the username or ID only when the tag is built.
    setValues((current) => ({ ...current, [id]: value }));
  }

  function addMultiValue(id: string) {
    setMultiValues((current) => ({ ...current, [id]: [...(current[id] ?? []), ""] }));
  }

  function setMultiValue(id: string, index: number, value: string) {
    setMultiValues((current) => {
      const list = [...(current[id] ?? [])];
      list[index] = value;
      return { ...current, [id]: list };
    });
  }

  function removeMultiValue(id: string, index: number) {
    setMultiValues((current) => {
      const list = (current[id] ?? []).filter((_, position) => position !== index);
      return { ...current, [id]: list.length > 0 ? list : [""] };
    });
  }

  function placeholderFor(type: TagDataType): string {
    if (isSpotifyField(type.id)) return t("write.placeholderSpotify");
    if (isSocialField(type.id)) return t("write.placeholderSocial");
    return t("write.placeholder", { name: t(`field.${type.id}`, undefined, type.name) });
  }

  function fieldError(id: string, raw: string): string | undefined {
    const code = validateFieldValue(id, raw);
    return code ? t(`error.${code}`) : undefined;
  }

  function reset() {
    setSelected([]);
    setValues({});
    setMultiValues({});
    setWriteError(null);
    setStep("form");
  }

  async function confirmWrite() {
    if (!(await ensureNfcActive())) return;

    const count = Object.keys(selectedValues).length;
    Alert.alert(
      t("write.confirm.title"),
      `${t("write.confirm.subtitle", { count })}\n\n${t("write.confirm.overwriteBody")}`,
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("write.confirm.overwriteAction"),
          style: "destructive",
          onPress: () => {
            setWriteError(null);
            setStep("writing");
          },
        },
      ],
    );
  }

  const addButton = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t("write.addField")}
      onPress={() => setModalVisible(true)}
      style={({ pressed }) => [shadow.card, pressed ? { opacity: 0.85 } : null]}
      className="h-14 w-14 items-center justify-center rounded-xl bg-accent"
    >
      <Feather name="plus" size={26} color={colors.onPrimary} />
    </Pressable>
  );

  if (step === "writing") {
    return (
      <Screen scroll={false} className="justify-center">
        <StatePanel
          tone="loading"
          title={t("write.writing.title")}
          message={t("write.writing.message")}
        />
      </Screen>
    );
  }

  if (step === "success") {
    return (
      <Screen scroll={false} className="justify-center">
        <StatePanel
          tone="success"
          title={t("write.success.title")}
          message={t("write.success.message", { count: Object.keys(selectedValues).length })}
          action={<Button onPress={reset}>{t("write.success.action")}</Button>}
        />
      </Screen>
    );
  }

  if (step === "error") {
    return (
      <Screen scroll={false} className="justify-center">
        <StatePanel
          tone="error"
          title={t("write.error.title")}
          message={
            writeError ? t(`error.${writeError.code}`, undefined, writeError.message) : undefined
          }
          action={<Button onPress={() => setStep("form")}>{t("common.tryAgain")}</Button>}
        />
      </Screen>
    );
  }

  return (
    <Screen
      floating={addButton}
      scrollRef={scrollRef}
      onViewportChange={(height) => {
        viewportHeight.current = height;
      }}
      footer={
        <Button
          size="lg"
          icon="edit-3"
          disabled={!canWrite}
          onPress={confirmWrite}
        >
          {selected.length === 0 ? t("write.addFieldToContinue") : t("write.writeToTag")}
        </Button>
      }
    >
      <Text className="text-[32px] leading-[38px] text-ink" style={{ fontFamily: fonts.display }}>
        {t("write.title")}
      </Text>
      <Text className="mt-3 font-body text-[16px] leading-6 text-ink opacity-70">
        {t("write.subtitle")}
      </Text>

      {selectedTypes.length === 0 ? (
        <View className="mt-5">
          <StatePanel
            tone="empty"
            title={t("write.empty.title")}
            message={t("write.empty.message")}
            action={
              <Button icon="plus" onPress={() => setModalVisible(true)}>
                {t("write.addField")}
              </Button>
            }
          />
        </View>
      ) : (
        <View
          className="mt-5 gap-3"
          onLayout={(event) => {
            fieldsTop.current = event.nativeEvent.layout.y;
          }}
        >
          {selectedTypes.map((type) => (
            <View
              key={type.id}
              onLayout={(event) => {
                fieldOffsets.current[type.id] = event.nativeEvent.layout.y;
                fieldHeights.current[type.id] = event.nativeEvent.layout.height;
              }}
              style={shadow.card}
              className="rounded-lg border border-line bg-background p-4"
            >
              {type.multi ? (
                <MultiFieldInput
                  label={t(`field.${type.id}`, undefined, type.name)}
                  values={multiValues[type.id] ?? [""]}
                  measuredValues={(multiValues[type.id] ?? [""]).map((entry) =>
                    normalizeFieldValue(type.id, entry),
                  )}
                  errors={(multiValues[type.id] ?? [""]).map((entry) =>
                    fieldError(type.id, entry),
                  )}
                  placeholder={placeholderFor(type)}
                  maxChar={type.maxChar}
                  onChangeText={(index, value) => setMultiValue(type.id, index, value)}
                  onAdd={() => addMultiValue(type.id)}
                  onRemoveRow={(index) => removeMultiValue(type.id, index)}
                  onRemoveField={() => setPendingRemoveId(type.id)}
                  onFocus={() => focusField(type.id)}
                />
              ) : (
                <FieldInput
                  label={t(`field.${type.id}`, undefined, type.name)}
                  value={values[type.id] ?? ""}
                  measuredValue={normalizeFieldValue(type.id, values[type.id] ?? "")}
                  error={fieldError(type.id, values[type.id] ?? "")}
                  showCount={!isSpotifyField(type.id)}
                  onChangeText={(value) => setValue(type.id, value)}
                  maxChar={type.maxChar}
                  placeholder={placeholderFor(type)}
                  onRemove={() => setPendingRemoveId(type.id)}
                  onFocus={() => focusField(type.id)}
                  {...inputOptionsFor(type)}
                />
              )}
            </View>
          ))}
        </View>
      )}

      <View className="mt-6">
        <CapacityMeter size={size} capacity={TAG_CAPACITY_BYTES} />
      </View>

      <AddFieldModal
        visible={modalVisible}
        available={availableTypes}
        onClose={() => setModalVisible(false)}
        onAdd={addFields}
      />

      <ConfirmDialog
        visible={pendingRemoveId !== null}
        title={t("write.remove.title", {
          name: pendingRemoveType
            ? t(`field.${pendingRemoveType.id}`, undefined, pendingRemoveType.name)
            : "",
        })}
        message={t("write.remove.message")}
        confirmLabel={t("write.remove.confirm")}
        onConfirm={() => {
          if (pendingRemoveId) removeField(pendingRemoveId);
          setPendingRemoveId(null);
        }}
        onCancel={() => setPendingRemoveId(null)}
      />
    </Screen>
  );
}
