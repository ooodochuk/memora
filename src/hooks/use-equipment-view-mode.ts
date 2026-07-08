"use client";

import { useCallback, useEffect, useState } from "react";

export const EQUIPMENT_VIEW_MODE_STORAGE_KEY = "memora.equipment.viewMode";

export type EquipmentViewMode = "cards" | "table";

function readDefaultViewMode(): EquipmentViewMode {
  if (typeof window === "undefined") return "table";
  try {
    const stored = localStorage.getItem(EQUIPMENT_VIEW_MODE_STORAGE_KEY);
    if (stored === "cards" || stored === "table") return stored;
  } catch {
    /* ignore */
  }
  return window.matchMedia("(min-width: 1024px)").matches ? "table" : "cards";
}

export function useEquipmentViewMode() {
  const [viewMode, setViewMode] = useState<EquipmentViewMode>("table");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setViewMode(readDefaultViewMode());
    setIsReady(true);
  }, []);

  const setMode = useCallback((mode: EquipmentViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(EQUIPMENT_VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, []);

  return { viewMode, setMode, isReady };
}
