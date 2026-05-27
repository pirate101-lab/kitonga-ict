"use client";

import {
 createContext,
 useCallback,
 useContext,
 useEffect,
 useMemo,
 useState,
} from "react";

export type Theme = "dark" | "light";

type ThemeContextValue = {
 theme: Theme;
 setTheme: (theme: Theme) => void;
 toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "kitonga.theme";

function readInitialTheme(): Theme {
 if (typeof window === "undefined") return "dark";
 const stored = window.localStorage.getItem(STORAGE_KEY);
 if (stored === "light" || stored === "dark") return stored;
 return window.matchMedia?.("(prefers-color-scheme: light)").matches
 ? "light"
 : "dark";
}

function applyTheme(theme: Theme) {
 if (typeof document === "undefined") return;
 document.documentElement.dataset.theme = theme;
 document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
 const [theme, setThemeState] = useState<Theme>("dark");

 useEffect(() => {
 const initial = readInitialTheme();
 setThemeState(initial);
 applyTheme(initial);
 }, []);

 const setTheme = useCallback((next: Theme) => {
 setThemeState(next);
 applyTheme(next);
 if (typeof window !== "undefined") {
 window.localStorage.setItem(STORAGE_KEY, next);
 }
 }, []);

 const toggle = useCallback(() => {
 setTheme(theme === "dark" ? "light" : "dark");
 }, [theme, setTheme]);

 const value = useMemo(
 () => ({ theme, setTheme, toggle }),
 [theme, setTheme, toggle],
 );

 return (
 <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
 );
}

export function useTheme() {
 const ctx = useContext(ThemeContext);
 if (!ctx) {
 throw new Error("useTheme must be used inside <ThemeProvider />");
 }
 return ctx;
}
