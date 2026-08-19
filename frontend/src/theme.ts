import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export const getAppTheme = (mode: PaletteMode) => {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#4f46e5",
        light: "#818cf8",
        dark: "#3730a3",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#0ea5e9",
      },
      background: isDark
        ? {
            default: "#0f172a",
            paper: "#111827",
          }
        : {
            default: "#f4f6fb",
            paper: "#ffffff",
          },
      text: isDark
        ? {
            primary: "#e5e7eb",
            secondary: "#94a3b8",
          }
        : {
            primary: "#1e293b",
            secondary: "#64748b",
          },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: [
        "Inter",
        "Segoe UI",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
      ].join(","),
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          elevation1: {
            boxShadow: isDark
              ? "0 1px 3px rgba(0, 0, 0, 0.4)"
              : "0 1px 3px rgba(15, 23, 42, 0.08)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#312e81" : "#4f46e5",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isDark
              ? "0 1px 3px rgba(0, 0, 0, 0.4)"
              : "0 1px 3px rgba(15, 23, 42, 0.08)",
          },
        },
      },
    },
  });
};
