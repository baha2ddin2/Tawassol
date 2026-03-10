"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, TextField, IconButton, Badge } from "@mui/material";
import {
  Send,
  PhotoCamera,
  AttachFile,
  ArrowDownward,
} from "@mui/icons-material";
import socket from "@/lib/soket";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  messages,
  sendMessage,
  reciveMessage,
} from "@/redux/reducers/messageReducer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Message from "@/components/message";
dayjs.extend(relativeTime);

export default function ChatPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const messagesData = useSelector((state) => state.message.messages) || [];
  const { contacts } = useSelector((state) => state.message);
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?.user?.user_id;
  const user = contacts?.find((c) => c.user_id === id);
  
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [sending, setSending] = useState(false);

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

    dispatch(messages(id));

    return () => {
      socket.off("joinedPrivateRoom", onJoined);
      socket.off("newPrivateMessage", onNew);
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

    scrollToBottom()
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

  return (
    <div className="h-[calc(100vh-90px)] flex flex-col overflow-hidden bg-white shadow-sm rounded-md">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b">
        <Avatar
          src={user ? `http://127.0.0.1:8000/storage/${user.avatar_url}` : ""}
          sx={{ width: 40, height: 40 }}
        />
        <div>
          <div className="font-semibold text-sm">
            {user?.display_name ?? "Unknown"}
          </div>
          <div className="text-xs text-gray-400">
            {user?.is_active ? "online" : "offline"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50"
      >
        {messagesData?.map((m) => <Message message={m} userId={userId} dayjs={dayjs} />)}
      </div>

      {/* Floating "scroll to bottom" button */}
      {showScrollBtn && (
        <div className="fixed right-6 bottom-24 z-50">
          <IconButton
            onClick={scrollToBottom}
            size="large"
            className="bg-white shadow-md"
          >
            <ArrowDownward />
          </IconButton>
        </div>
      )}

      {/* Attachment previews (small strip) */}
      {previews.length > 0 && (
        <div className="p-2 border-t bg-white flex gap-2 overflow-x-auto">
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

      {/* Input area */}
      <div className="flex gap-2 p-3 border-t items-end bg-white">
        {/* hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onFilesChange}
        />

        {/* attachments + camera icons */}
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
