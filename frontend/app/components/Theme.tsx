"use client";

import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useMemo, createContext, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

// Theme Context for global toggle
const ThemeToggleContext = createContext<() => void>(() => {});

export const useThemeToggle = () => useContext(ThemeToggleContext);

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#EC407A" },
          background: {
            default: mode === "light" ? "#f7f7fa" : "#121212",
            paper: mode === "light" ? "#fff" : "#1e1e1e",
          },
          text: {
            primary: mode === "light" ? "#000" : "#fff",
            secondary: mode === "light" ? "#555" : "#ccc",
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeToggleContext.Provider value={toggleTheme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Fixed theme toggle button */}
        <div
          style={{
            position: "fixed",
            top: 10,
            right: 10,
            zIndex: 1300,
            background: mode === "light" ? "#fff" : "#333",
            borderRadius: "50%",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </div>
        {children}
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
}
