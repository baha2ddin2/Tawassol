"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, TextField, IconButton, Tooltip, Typography } from "@mui/material";
import { Send, PhotoCamera, ArrowDownward, ArrowBack } from "@mui/icons-material";
import socket from "@/lib/soket";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  reciveGroupMessage,
  sendGroupMessage,
  GroupMessages,
  updatedGroupMessage,
  deletedGroupMessage,
  deleteGroupMessage,
  updateGroupMessage,
} from "@/redux/Slices/messageSlice";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import GroupMessage from "@/components/GroupMessage";
import { MessageSkeleton } from "@/components/Skelatons";
import { useTranslation } from "react-i18next";
dayjs.extend(relativeTime);

export default function GroupChatPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesData =
    useSelector((state) => state.message.GroupMessages) || [];
  const { contacts, loading } = useSelector((state) => state.message);
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?.user?.user_id;
  const { t } = useTranslation();

  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [sending, setSending] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const groupInfo = contacts?.find((c) => c.group_id === id);
  const [onlineMembers, setOnlineMembers] = useState(0);

  useEffect(() => {
    if (groupInfo?.members) {
      const count = groupInfo.members.filter(m => m.is_active && m.user_id !== userId).length;
      setOnlineMembers(count);
    }
  }, [groupInfo?.members, userId]);

  useEffect(() => {
    if (!id) return;
    socket.emit("joinGroupRoom", { groupId: id });
    socket.on("joinedGroupRoom", (data) => {
      console.log(data);
    });
    dispatch(GroupMessages(id));
    const onNewGroupMsg = (data) => {
      dispatch(reciveGroupMessage(data));
      const container = containerRef.current;
      if (!container) return;

      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      const NEAR_BOTTOM_THRESHOLD = 200;

      if (
        distanceFromBottom <= NEAR_BOTTOM_THRESHOLD ||
        data.sender_id === userId
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
    socket.on("newGroupMessage", onNewGroupMsg);

    const onDelete = (data) => {
      dispatch(deletedGroupMessage(data));
    };
    socket.on("messageDeleted", onDelete);

    const onUpdate = (data) => {
      dispatch(updatedGroupMessage(data));
    };
    socket.on("messageUpdated", onUpdate);

    const onUserStatusChanged = (data) => {
      // If a member of this group changes status, we might want to update our local count
      // but groupInfo is in Redux. For simplicity and real-time feel, we can just increment/decrement
      // if the user belongs to this group.
      const isMember = groupInfo?.members?.some(m => String(m.user_id) === String(data.userId));
      if (isMember) {
        setOnlineMembers(prev => data.status === "online" ? prev + 1 : Math.max(0, prev - 1));
      }
    };
    socket.on("user-status-changed", onUserStatusChanged);

    scrollToBottom();
    return () => {
      socket.off("joinGroupRoom");
      socket.off("newGroupMessage", onNewGroupMsg);
      socket.off("messageUpdated", onUpdate);
      socket.off("messageDeleted", onDelete);
      socket.off("user-status-changed", onUserStatusChanged);
    };
  }, [id, dispatch]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distance =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      setShowScrollBtn(distance > 400);
    };
    scrollToBottom();
    container.addEventListener("scroll", handleScroll);
    setTimeout(() => scrollToBottom("auto"), 100);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [id]);

  const onFilesChange = (e) => {
    const chosen = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...chosen]);
    const urls = chosen.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...urls]);
    e.target.value = null;
  };

  const handleSend = async () => {
    if (!text.trim() && files.length === 0) return;
    setSending(true);

    const formData = new FormData();
    formData.append("content", text);
    files.forEach((file) => formData.append("media", file));

    await dispatch(sendGroupMessage({ groupId: id, formData }));

    setText("");
    setFiles([]);
    setPreviews([]);
    setSending(false);
    scrollToBottom();
  };
  const scrollToBottom = () => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    setShowScrollBtn(false);
  };

  const handelUpdate = (messageId, newContent) => {
    dispatch(updateGroupMessage({ messageId, newContent }));
  };

  const handelDelete = (messageId) => {
    dispatch(deleteGroupMessage(messageId));
  };

  return (
    <div className="h-[calc(100dvh-90px)] md:h-[calc(100vh-90px)] max-sm:h-[calc(100vh-138px)] max-sm:fixed max-sm:w-[100vw] flex flex-col bg-[var(--card-bg)] shadow-sm rounded-md overflow-hidden relative transition-colors duration-300">
      {/* Group Header */}
      <div className="flex items-center gap-3 p-3 border-b border-[var(--card-border)] bg-[var(--card-bg)] z-10 transition-colors duration-300">
        <IconButton
          className="md:hidden"
          onClick={() => router.push("/messages")}
          edge="start"
          sx={{ color: "var(--color-primary)" }}
        >
          <ArrowBack />
        </IconButton>
        <Link href={`${id}/info`} className="flex items-center gap-3 flex-1">
          <Avatar
            src={
              groupInfo?.photo_url
                ? `http://127.0.0.1:8000/storage/${groupInfo.photo_url}`
                : "/groupAvatar.jpeg"
            }
            sx={{ width: 40, height: 40 }}
          />
          <div>
            <div className="font-semibold text-sm text-[var(--text-primary)]">
              {groupInfo?.name || "Group Chat"}
            </div>
            <div className="text-[10px] text-gray-400 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${onlineMembers > 0 ? "bg-[#709601]" : "bg-gray-400"}`}></span>
              {onlineMembers > 0 
                ? `${onlineMembers} ${t("messages.online", "Online")}`
                : t("messages.offline", "Offline")
              }
            </div>
          </div>
        </Link>
      </div>

      {/* Messages Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 bg-[var(--background)] transition-colors duration-300"
      >
        {loading ? (
          <MessageSkeleton />
        ) : messagesData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-[var(--text-muted)] h-full">
            <Typography className="font-medium text-[var(--text-primary)]">
              {t("messages.noMessages", "No messages yet. Start the conversation!")}
            </Typography>
          </div>
        ) : (
          messagesData.map((m, index) => (
            <GroupMessage
              key={m.message_id}
              index={index}
              messagesData={messagesData}
              message={m}
              userId={userId}
              dayjs={dayjs}
              handelDelete={handelDelete}
              handelUpdate={handelUpdate}
            />
          ))
        )}
      </div>

      {/* Floating Scroll Button */}
      {showScrollBtn && (
        <div className="fixed right-6 bottom-24 z-50">
          <IconButton
            onClick={scrollToBottom}
            size="large"
            className="bg-[var(--card-bg)] shadow-md"
          >
            <ArrowDownward sx={{ color: "var(--text-primary)" }} />
          </IconButton>
        </div>
      )}

      {/* Attachment Previews */}
      {previews.length > 0 && (
        <div className="p-2 border-t border-[var(--card-border)] flex gap-2 overflow-x-auto bg-[var(--background)]">
          {previews.map((p, i) => (
            <div key={i} className="relative h-16 w-16 flex-shrink-0">
              <img
                src={p}
                className="h-full w-full object-cover rounded shadow"
              />
              <button
                onClick={() => {
                  setPreviews(previews.filter((_, idx) => idx !== i));
                  setFiles(files.filter((_, idx) => idx !== i));
                }}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px]"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-[var(--card-border)] bg-[var(--card-bg)] flex items-center gap-2 transition-colors duration-300">
        <input
          type="file"
          ref={fileInputRef}
          hidden
          multiple
          accept="image/*"
          onChange={onFilesChange}
        />
        <IconButton onClick={() => fileInputRef.current.click()} size="small">
          <PhotoCamera sx={{ color: "var(--text-muted)" }} />
        </IconButton>

        <TextField
          fullWidth
          size="small"
          placeholder={t("messages.writeMessage")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), handleSend())
          }
          multiline
          maxRows={4}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "var(--text-primary)",
              bgcolor: "var(--input-bg)",
              borderRadius: "12px",
              "& fieldset": { borderColor: "var(--input-border)" },
              "&:hover fieldset": { borderColor: "var(--text-muted)" },
            },
          }}
        />

        <IconButton color="primary" onClick={handleSend} disabled={sending}>
          <Send />
        </IconButton>
      </div>
    </div>
  );
}
