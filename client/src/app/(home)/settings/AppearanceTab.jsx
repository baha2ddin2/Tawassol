"use client";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Sun, Moon } from "lucide-react";

export default function AppearanceTab() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 transition-colors duration-300">
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
        {t("settings.appearance")}
      </h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        {t("settings.themeDescription")}
      </p>

      <div className="flex gap-4">
        {/* Light */}
        <button
          onClick={() => isDark && toggleTheme()}
          className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
            !isDark
              ? "border-[var(--color-primary)] bg-[var(--nav-pill-bg)] shadow-md"
              : "border-[var(--card-border)] hover:border-[var(--text-muted)]"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center">
            <Sun size={24} className="text-white" />
          </div>
          <span className="font-bold text-sm text-[var(--text-primary)]">
            {t("settings.lightMode")}
          </span>
          {!isDark && (
            <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
              {t("settings.currentTheme")}
            </span>
          )}
        </button>

        {/* Dark */}
        <button
          onClick={() => !isDark && toggleTheme()}
          className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
            isDark
              ? "border-[var(--color-primary)] bg-[var(--nav-pill-bg)] shadow-md"
              : "border-[var(--card-border)] hover:border-[var(--text-muted)]"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center">
            <Moon size={24} className="text-white" />
          </div>
          <span className="font-bold text-sm text-[var(--text-primary)]">
            {t("settings.darkMode")}
          </span>
          {isDark && (
            <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
              {t("settings.currentTheme")}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
