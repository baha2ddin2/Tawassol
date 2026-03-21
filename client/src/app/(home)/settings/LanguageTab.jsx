"use client";
import { useTranslation } from "react-i18next";
import i18nInstance from "@/lib/i18n";

export default function LanguageTab() {
  const { t } = useTranslation();
  const currentLang = i18nInstance.language;

  const languages = [
    { code: "en", label: t("settings.english"), flag: "🇬🇧" },
    { code: "fr", label: t("settings.french"), flag: "🇫🇷" },
  ];

  const changeLang = (code) => {
    i18nInstance.changeLanguage(code);
    localStorage.setItem("tawassol-lang", code);
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 transition-colors duration-300">
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
        {t("settings.language")}
      </h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        {t("settings.languageDescription")}
      </p>

      <div className="space-y-3">
        {languages.map((lang) => {
          const isActive = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => changeLang(lang.code)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-[var(--color-primary)] bg-[var(--nav-pill-bg)] shadow-md"
                  : "border-[var(--card-border)] hover:border-[var(--text-muted)]"
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-bold text-sm text-[var(--text-primary)]">
                {lang.label}
              </span>
              {isActive && (
                <span className="ml-auto text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
