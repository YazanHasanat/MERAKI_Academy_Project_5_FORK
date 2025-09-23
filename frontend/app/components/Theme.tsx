"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#EC407A" },
        },
      }),
    [mode]
  );

  const toggleTheme = () => setMode(mode === "light" ? "dark" : "light");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          zIndex: 1300, 
          background: mode === "light" ? "#fff" : "#333",
          borderRadius: "50%",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </div>
      {children}
    </ThemeProvider>
  );
}
