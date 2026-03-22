"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, TextField, IconButton,Typography } from "@mui/material";
import {
  Send,
  PhotoCamera,
  ArrowDownward,
  ArrowBack,
} from "@mui/icons-material";
import socket from "@/lib/soket";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  messages,
  sendMessage,
  reciveMessage,
  deleteMessage,
  deletedMessage,
  getContact,
  updateMessage,
  updatedMessage,
  seenMessageAction,
} from "@/redux/Slices/messageSlice";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Message from "@/components/Message";
import { MessageSkeleton as PrivateMessageSkeleton } from "@/components/Skelatons";
import Link from "next/link";
import { useTranslation } from "react-i18next";

dayjs.extend(relativeTime);

export default function ChatPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();
  const messagesData = useSelector((state) => state.message.messages) || [];
  const { contact, loading } = useSelector((state) => state.message);
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?.user?.user_id;

  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [sending, setSending] = useState(false);
  
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(contact?.is_active === 1 || contact?.is_active === true);

  useEffect(() => {
    setIsOnline(contact?.is_active === 1 || contact?.is_active === true);
  }, [contact?.is_active]);

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    if (!id) return;
    dispatch(messages(id));
    dispatch(getContact(id));

    socket.emit("joinPrivateRoom", { otherUserId: id });
    const onJoined = (data) => {
      console.log("Joined room:", data.room);
    };
    socket.on("joinedPrivateRoom", onJoined);

    const onNew = (data) => {
      dispatch(reciveMessage(data));

      const container = containerRef.current;
      if (!container) return;

      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      const NEAR_BOTTOM_THRESHOLD = 200;

      if (
        distanceFromBottom <= NEAR_BOTTOM_THRESHOLD ||
        normalized.is_user === 1
      ) {
        requestAnimationFrame(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
          setShowScrollBtn(false);
        });
      } else {
        setShowScrollBtn(true);
      }
    };

    socket.on("newPrivateMessage", onNew);

    const onDelete = (data) => {
      dispatch(deletedMessage(data));
    };

    socket.on("privateMessageDeleted", onDelete);

    const onUpdate = (data) => {
      dispatch(updatedMessage(data));
    };
    socket.on("privateMessageUpdated", onUpdate);

    const onSeen = (data) => {
      dispatch(seenMessageAction(data));
    };

    socket.on("privateMessageSeen", onSeen);

    const onUserStatusChanged = (data) => {
      if (String(data.userId) === String(id)) {
        setIsOnline(data.status === "online");
      }
    };
    socket.on("user-status-changed", onUserStatusChanged);

    return () => {
      socket.off("joinedPrivateRoom", onJoined);
      socket.off("newPrivateMessage", onNew);
      socket.off("privateMessageDeleted", onDelete);
      socket.off("privateMessageUpdated", onUpdate);
      socket.off("privateMessageSeen", onSeen);
      socket.off("user-status-changed", onUserStatusChanged);
    };
  }, [id, dispatch]);

  useEffect(() => {
    let mounted = true;
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }

    (async () => {
      const urls = [];
      for (const f of files) {
        try {
          const url = await fileToDataUrl(f);
          urls.push(url);
        } catch (e) {
          console.error("file preview error", e);
        }
      }
      if (mounted) setPreviews(urls);
    })();

    return () => {
      mounted = false;
    };
  }, [files]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      setShowScrollBtn(distanceFromBottom > 300);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setTimeout(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: "auto" });
      setShowScrollBtn(false);
    }, 50);
  }, [id]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const NEAR_BOTTOM_THRESHOLD = 200;

    if (distanceFromBottom <= NEAR_BOTTOM_THRESHOLD) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      setShowScrollBtn(false);
    } else {
      const last = messagesData[messagesData.length - 1];
      if (last && last.is_user === 1) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
        setShowScrollBtn(false);
      } else {
        setShowScrollBtn(true);
      }
    }

    scrollToBottom();
  }, [messagesData.length]);

  const handleSend = async () => {
    if ((!text || text.trim() === "") && files.length === 0) return;

    setSending(true);

    const formData = new FormData();
    formData.append("content", text);
    files.forEach((img, index) => {
      return formData.append(`media`, img);
    });

    dispatch(sendMessage({ formData, reciveMessage: id }));

    setText("");
    setFiles([]);
    setPreviews([]);

    const container = containerRef.current;
    if (container) {
      setTimeout(
        () =>
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          }),
        80,
      );
    }
    setSending(false);
  };

  const onFilesChange = (e) => {
    const chosen = Array.from(e.target.files || []);
    const imgs = chosen.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...imgs]);
    e.target.value = null;
  };

  const removePreview = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    setShowScrollBtn(false);
  };

  const handleDelete = (messageId) => {
    dispatch(deleteMessage(messageId));
  };

  const handleUpdate = (messageId, newContent) => {
    dispatch(updateMessage({ messageId, newContent }));
  };

  return (
    <div className="h-[calc(100dvh-90px)] md:h-[calc(100vh-80px)] max-sm:h-[calc(100vh-138px)] max-sm:fixed max-sm:w-[100vw]   flex flex-col justify-center overflow-hidden bg-[var(--card-bg)] shadow-sm md:rounded-md border border-[var(--card-border)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-[var(--card-border)]">
        <IconButton
          className="md:hidden"
          onClick={() => router.push("/messages")}
          edge="start"
          sx={{ color: "var(--color-primary)" }}
        >
          <ArrowBack />
        </IconButton>
        <Avatar
          src={
            contact ? `http://127.0.0.1:8000/storage/${contact.avatar_url}` : ""
          }
          sx={{ width: 40, height: 40 }}
        />
        <div>
          <div className="font-semibold text-sm">
            <Link href={`/profile/${contact.user_id}`} >{contact?.display_name ?? "Unknown"}</Link>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-[#709601]" : "bg-gray-400"}`}></span>
            {isOnline ? t("messages.online", "Online") : t("messages.offline", "Offline")}
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3  bg-[var(--background)]"
      >
        {loading ? (
          <PrivateMessageSkeleton />
        ) : messagesData?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-[var(--text-muted)] h-full">
            <Typography className="font-medium text-[var(--text-primary)]">
              {t("messages.noMessages", "No messages yet. Start the conversation!")}
            </Typography>
          </div>
        ) : (
          messagesData.map((m) => (
            <Message
              key={m.message_id}
              message={m}
              userId={userId}
              dayjs={dayjs}
              handelDelete={handleDelete}
              handleUpdate={handleUpdate}
            />
          ))
        )}
      </div>

      {showScrollBtn && (
        <div className="fixed right-6 bottom-24 z-50">
          <IconButton
            onClick={scrollToBottom}
            size="large"
            className="bg-[var(--card-bg)] shadow-md text-[var(--text-primary)]"
          >
            <ArrowDownward />
          </IconButton>
        </div>
      )}

      {previews.length > 0 && (
        <div className="p-2 border-t border-[var(--card-border)] bg-[var(--card-bg)] flex gap-2 overflow-x-auto">
          {previews.map((p, idx) => (
            <div key={idx} className="relative">
              <img
                src={p}
                alt={`preview-${idx}`}
                className="w-20 h-20 object-cover rounded-md"
              />
              <button
                onClick={() => removePreview(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 p-3 border-t border-[var(--card-border)] items-end bg-[var(--card-bg)]">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onFilesChange}
        />

        <div className="flex items-center gap-1">
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            size="large"
            color="primary"
          >
            <PhotoCamera />
          </IconButton>
        </div>

        <div className="flex-1">
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            multiline
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "var(--input-bg)",
                "& fieldset": { borderColor: "var(--input-border)" },
                "&:hover fieldset": { borderColor: "var(--color-primary)" },
              },
              "& .MuiInputBase-input": { color: "var(--text-primary)" }
            }}
          />
        </div>

        <div className="flex items-center">
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={sending}
            size="large"
          >
            <Send />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
