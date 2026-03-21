'use client'
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Page() {
  const [animate, setAnimate] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-[var(--background)] transition-colors duration-300">
      <div
        className={`p-8 rounded-3xl shadow-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-center transform transition-all duration-700 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] animate-bounce">
          {t("messages.selectConversation")}
        </h1>
        <p className="mt-2 text-[var(--text-muted)]">{t("messages.chatAppearHere")}</p>
      </div>
    </div>
  );
}