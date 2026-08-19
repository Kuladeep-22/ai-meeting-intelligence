import { create } from "zustand";
import type { PaletteMode } from "@mui/material";

interface ThemeStore {
  mode: PaletteMode;
  setMode: (mode: PaletteMode) => void;
  toggleMode: () => void;
}

const STORAGE_KEY = "app_theme_mode";

const getInitialMode = (): PaletteMode => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "dark" ? "dark" : "light";
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: getInitialMode(),

  setMode: (mode) => {
    localStorage.setItem(STORAGE_KEY, mode);
    set({ mode });
  },

  toggleMode: () => {
    const nextMode: PaletteMode = get().mode === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, nextMode);
    set({ mode: nextMode });
  },
}));
