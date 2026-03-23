"use client";
import { contact } from "@/redux/Slices/messageSlice";
import { Avatar, Button,Typography } from "@mui/material";
import { GroupAdd } from "@mui/icons-material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import CreateGroup from "@/components/CreateGroup";
import { ContactSkeleton } from "@/components/Skelatons";
import { useTranslation } from "react-i18next";

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { contacts, loading } = useSelector((state) => state.message);
  const { t } = useTranslation();
  const pathname = usePathname();
  const isChatActive = pathname !== "/messages";

  useEffect(() => {
    dispatch(contact());
  }, [dispatch]);

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-[var(--background)] transition-colors duration-300">
      {/* LEFT SIDEBAR */}
      <div className={`${isChatActive ? "hidden md:flex" : "flex"} w-full md:w-1/3 bg-[var(--card-bg)] flex-col border-r border-[var(--card-border)] shadow-sm transition-colors duration-300`}>
        {/* Header */}
        <div className="p-4 border-b border-[var(--card-border)] flex justify-between items-center sticky top-0 bg-[var(--card-bg)] z-10 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t("messages.title")}</h2>
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            size="small"
            startIcon={<GroupAdd />}
            className="rounded-xl! shadow-md hover:shadow-lg transition-all"
            sx={{
              bgcolor: "var(--color-primary)",
              "&:hover": { bgcolor: "var(--color-primary-dark)" },
            }}
          >
            {t("messages.createGroup")}
          </Button>

          <CreateGroup open={open} setOpen={setOpen} />
        </div>

        {/* CONTACT LIST */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {loading ? (
            [...Array(6)].map((_, i) => <ContactSkeleton key={i} />)
          ) : !contacts || contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-[var(--text-muted)] h-full">
              <GroupAdd sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography className="font-medium text-[var(--text-primary)]">
                {t("messages.noContactsFound", "No contacts yet")}
              </Typography>
              <Typography className="text-sm mt-1">
                {t("messages.startTheConversation", "Start connecting to see your conversations here.")}
              </Typography>
            </div>
          ) : (
            [...contacts]
              .sort((a, b) => {
                const timeA = new Date(a.last_message_time).getTime();
                const timeB = new Date(b.last_message_time).getTime();
                return timeB - timeA;
              })
              .map((c) => (
                <Link
                  key={c.user_id || c.group_id}
                  href={
                    c.type === "private"
                      ? `/messages/${c.user_id}`
                      : `/messages/group/${c.group_id}`
                  }
                >
                  <div className="flex items-center gap-3 p-4 hover:bg-[var(--hover-overlay)] transition-all cursor-pointer border-b border-[var(--card-border)] rounded-r-xl">
                    <Avatar
                      src={`http://127.0.0.1:8000/storage/${
                        c.type === "private" ? c.avatar_url : c.photo_url
                      }`}
                      className="w-12 h-12 hover:scale-105 transition-transform duration-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--text-primary)] truncate">
                        {c.type === "private" ? c.display_name : c.name}
                      </p>
                      <div className="flex justify-between items-center text-[var(--text-muted)]">
                        <p className="text-sm truncate w-[140px] md:w-[100px] lg:w-[140px] mr-2">
                          {c.last_message || t("messages.startConversation")}
                        </p>
                        {c.last_message_time && (
                          <span className="text-xs whitespace-nowrap">
                            {new Date(c.last_message_time).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className={`${isChatActive ? "flex" : "hidden md:flex"} w-full md:w-2/3 flex-col bg-[var(--background)] md:p-4 overflow-hidden transition-colors duration-300`}>
        {children ? (
          children
        ) : (
          <div className="flex justify-center items-center h-full text-[var(--text-muted)] text-lg font-medium">
            {t("messages.selectConversation")}
          </div>
        )}
      </div>
    </div>
  );
}
