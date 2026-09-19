import { useCallback, useEffect, useState } from "react";
import type { NfcAvailability } from "./nfc";
import { getNfcAvailability, openNfcSettings } from "./nfc";

export function useNfcStatus() {
  const [status, setStatus] = useState<NfcAvailability>("unsupported");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getNfcAvailability().then((next) => {
      if (!active) return;
      setStatus(next);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    const next = await getNfcAvailability();
    setStatus(next);
    setLoading(false);
    return next;
  }, []);

  return { status, loading, refresh, openSettings: openNfcSettings };
}
