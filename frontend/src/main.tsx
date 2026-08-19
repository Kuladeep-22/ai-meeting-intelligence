import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useMemo } from "react";

import App from "./App";
import { getAppTheme } from "./theme";
import { useThemeStore } from "./store/themeStore";

import "./index.css";

const RootApp = () => {
  const mode = useThemeStore((state) => state.mode);
  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);