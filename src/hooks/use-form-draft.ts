"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  readFormDraft,
  removeFormDraft,
  writeFormDraft,
} from "@/lib/form-draft/storage";

const DEFAULT_DEBOUNCE_MS = 500;

export interface UseFormDraftOptions {
  key: string;
  enabled?: boolean;
  debounceMs?: number;
}

export function useFormDraft<T>({
  key,
  enabled = true,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: UseFormDraftOptions) {
  const [restored, setRestored] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const restoreDraft = useCallback((): T | null => {
    if (!enabled) return null;
    return readFormDraft<T>(key);
  }, [enabled, key]);

  const saveDraft = useCallback(
    (data: T) => {
      if (!enabled) return;

      setIsDirty(true);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        writeFormDraft(key, data);
      }, debounceMs);
    },
    [debounceMs, enabled, key],
  );

  const clearDraft = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    removeFormDraft(key);
    setIsDirty(false);
    setRestored(false);
  }, [key]);

  const markRestored = useCallback(() => {
    setRestored(true);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    restored,
    isDirty,
    restoreDraft,
    saveDraft,
    clearDraft,
    markRestored,
  };
}
