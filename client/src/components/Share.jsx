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

export default function SharePost({ url, text }) {
  const [open, setOpen] = useState(false);

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
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center gap-2 w-full py-2 px-4 normal-case text-blue-600 font-normal to-blue-400 rounded-md transition-colors"
      >
        <ShareOutlined className=" text-blue-500"  />
        <span className=" text-blue-600" >Share</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full right-0 mb-2 w-52 bg-white shadow-xl border border-gray-100 rounded-xl p-3 flex flex-col gap-3 z-50">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 hover:text-blue-500 text-sm"
            >
              <ContentCopy fontSize="inherit" />
              Copy Link
            </button>
            <a
              href={`https://wa.me/?text=${url}`}
              target="_blank"
              className="flex items-center gap-2 hover:text-green-500"
            >
              <WhatsApp fontSize="small" />
              WhatsApp
            </a>

            <a
              href={`https://x.com/intent/tweet?url=${url}&text=${text}`}
              target="_blank"
              className="flex items-center gap-2 hover:text-black"
            >
              <X fontSize="small" />
              X
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              target="_blank"
              className="flex items-center gap-2 hover:text-blue-600"
            >
              <Facebook fontSize="small" />
              Facebook
            </a>

            <button
              onClick={handleNativeShare}
              className="flex items-center gap-2 hover:text-purple-500"
            >
              <PhoneIphone fontSize="small" />
              Share to Contacts
            </button>
          </div>
        </>
      )}
    </div>
  );
}
