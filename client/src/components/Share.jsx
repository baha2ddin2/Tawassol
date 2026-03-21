"use client";

import { useState } from "react";
import {
  ShareOutlined,
  ContentCopy,
  WhatsApp,
  Twitter,
  Facebook,
  PhoneIphone,
  X,
} from "@mui/icons-material";
import { gooeyToast } from "goey-toast";
import { useTranslation } from "react-i18next";

export default function SharePost({ url, text }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    gooeyToast.success("Link copied !");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Check this post",
        text: text,
        url: url,
      });
    } else {
      gooeyToast.error("Sharing not supported on this device",{
        duration : 3000,
      });
    }
  };

  return (
    <div className="relative w-full">
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="flex items-center justify-center gap-2 w-full py-2 px-4 normal-case text-[var(--text-primary)] font-normal rounded-md transition-colors cursor-pointer"
      >
        <ShareOutlined sx={{ color: "var(--text-primary)" }} />
        <span>{t("post.share", "Share")}</span>
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          <div className="absolute bottom-full right-0 mb-2 w-52 bg-[var(--card-bg)] shadow-xl border border-[var(--card-border)] text-[var(--text-primary)] rounded-xl p-3 flex flex-col gap-3 z-50">
            <div
               role="button"
               onClick={(e) => { e.stopPropagation(); copyLink(); }}
               className="flex items-center gap-2 hover:text-[var(--color-primary)] text-sm cursor-pointer"
            >
              <ContentCopy fontSize="inherit" />
              {t("post.copyLink", "Copy Link")}
            </div>
            <a
              href={`https://wa.me/?text=${url}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 hover:text-green-500"
            >
              <WhatsApp fontSize="small" />
              WhatsApp
            </a>

            <a
              href={`https://x.com/intent/tweet?url=${url}&text=${text}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 hover:text-slate-400"
            >
              <X fontSize="small" />
              X
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 hover:text-[var(--color-primary)]"
            >
              <Facebook fontSize="small" />
              Facebook
            </a>

            <div
              role="button"
              onClick={(e) => { e.stopPropagation(); handleNativeShare(); }}
              className="flex items-center gap-2 hover:text-purple-500 cursor-pointer text-sm"
            >
              <PhoneIphone fontSize="small" />
              {t("post.shareContacts", "Share to Contacts")}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
