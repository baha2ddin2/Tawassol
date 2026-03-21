"use client";
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tawassol-theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("tawassol-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
        },
        components: {
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  color: "var(--text-primary)",
                  backgroundColor: "var(--input-bg)",
                  "& fieldset": { borderColor: "var(--input-border)" },
                  "&:hover fieldset": { borderColor: "var(--text-muted)" },
                  "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" },
                },
                "& .MuiInputLabel-root": { color: "var(--text-muted)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
                "& .MuiInputBase-input": { color: "var(--text-primary)" },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              root: {
                color: "var(--text-primary)",
                backgroundColor: "var(--input-bg)",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--input-border)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--text-muted)" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--color-primary)" },
              },
              icon: {
                color: "var(--text-primary)",
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                backgroundColor: "var(--card-bg)",
                color: "var(--text-primary)",
                border: "1px solid var(--card-border)",
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                "&:hover": { backgroundColor: "var(--hover-overlay)" },
              },
            },
          },
        },
      }),
    [theme]
  );

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
