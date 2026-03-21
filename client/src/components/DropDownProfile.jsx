"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Dropdown({ children, logout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}>{children}</button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-3 w-44 bg-[var(--card-bg)] rounded-2xl shadow-xl border border-[var(--card-border)] 
        transform transition-all duration-200 ease-out z-50
        ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <ul className="py-2 text-sm text-[var(--text-primary)]">
          <li>
            <Link href={"/profile"}>
              <button className="w-full text-left px-4 py-2 hover:bg-[var(--hover-overlay)] transition">
                {t("nav.profile", "profile")}
              </button>
            </Link>
          </li>
          <li>
            <Link href={"/settings"}>
              <button className="w-full text-left px-4 py-2 hover:bg-[var(--hover-overlay)] transition">
                {t("nav.settings", "settings")}
              </button>
            </Link>
          </li>
          <li>
            <button
              onClick={() => logout()}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-[var(--hover-overlay)] transition"
            >
              {t("nav.logout", "logout")}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
