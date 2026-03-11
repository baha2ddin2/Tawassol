"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, TextField, IconButton, Tooltip } from "@mui/material";
import { Send, PhotoCamera, ArrowDownward } from "@mui/icons-material";
import socket from "@/lib/soket";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  reciveGroupMessage,
  sendGroupMessage,
  GroupMessages,
} from "@/redux/Slices/messageSlice";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
dayjs.extend(relativeTime);

export default function GroupChatPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesData =
    useSelector((state) => state.message.GroupMessages) || [];
  const { contacts } = useSelector((state) => state.message);
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?.user?.user_id;

  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [sending, setSending] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const groupInfo = contacts?.find((c) => c.group_id === id);

  useEffect(() => {
    if (!id) return;
    socket.emit("joinGroupRoom", { groupId: id });
    socket.on("joinedGroupRoom", (data) => {
      console.log(data);
    });

    const onNewGroupMsg = (data) => {
      dispatch(reciveGroupMessage(data));
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

    socket.on("newGroupMessage", onNewGroupMsg);
    dispatch(GroupMessages(id));
    scrollToBottom();

    return () => {
      socket.off("joinGroupRoom");
      socket.off("newGroupMessage", onNewGroupMsg);
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

  return (
    <div className="h-[calc(100vh-90px)] flex flex-col bg-white shadow-sm rounded-md overflow-hidden relative">
      {/* Group Header */}
      <Link href={`${id}/info`}>
        <div className="flex items-center gap-3 p-3 border-b bg-white z-10">
          <Avatar
            src={
              groupInfo?.photo_url
                ? `http://127.0.0.1:8000/storage/${groupInfo.photo_url}`
                : "/groupAvatar.jpeg"
            }
            sx={{ width: 40, height: 40 }}
          />
          <div>
            <div className="font-semibold text-sm">
              {groupInfo?.name || "Group Chat"}
            </div>
          </div>
        </div>
      </Link>

      {/* Messages Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 bg-slate-50"
      >
        {messagesData.map((m, index) => {
          const isMe = m.sender_id === userId;
          const prevMsg = messagesData[index - 1];
          const isSameAsPrev = prevMsg && prevMsg.sender_id === m.sender_id;
          const showHeader = !isSameAsPrev && !isMe;
          let attachments = [];
          try {
            if (Array.isArray(m.media)) {
              attachments = m.media;
            } else if (typeof m.media === "string") {
              attachments = JSON.parse(m.media);
            } else if (m.media) {
              attachments = Array.isArray(m.media) ? m.media : [m.media];
            }
          } catch (e) {
            attachments = [];
          }
          return (
            <div
              key={m.message_id || index}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"} ${!isSameAsPrev ? "mt-4" : "mt-0.5"}`}
            >
              {/* Sender Name (only for others and first message in a row) */}
              {showHeader && (
                <span className="text-[11px] font-bold text-blue-600 ml-10 mb-1">
                  {m.display_name}
                </span>
              )}

              <div
                className={`flex items-end gap-2 max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar (only for others and first message in a row) */}
                {!isMe ? (
                  <div className="w-8">
                    {!isSameAsPrev ? (
                      <Avatar
                        src={`http://127.0.0.1:8000/storage/${m.sender_avatar}`}
                        sx={{ width: 32, height: 32 }}
                      />
                    ) : null}
                  </div>
                ) : null}

                {/* Message Bubble */}
                <div
                  className={`px-3 py-2 rounded-2xl text-sm shadow-sm 
                  ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none"}
                  ${isSameAsPrev ? (isMe ? "rounded-tr-2xl" : "rounded-tl-2xl") : ""} 
                `}
                >
                  {m.content && (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}

                  {/* Media Rendering */}
                  {attachments && attachments.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {attachments.map((att, i) => (
                        <img
                          key={i}
                          src={`http://127.0.0.1:3001/${att.url}`}
                          alt=""
                          className="w-full h-32 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1 text-right ${isMe ? "text-blue-100" : "text-gray-400"}`}
                  >
                    {dayjs(m.created_at).format("HH:mm")}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Scroll Button */}
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

      {/* Attachment Previews */}
      {previews.length > 0 && (
        <div className="p-2 border-t flex gap-2 overflow-x-auto bg-gray-50">
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
      <div className="p-3 border-t bg-white flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          hidden
          multiple
          accept="image/*"
          onChange={onFilesChange}
        />
        <IconButton onClick={() => fileInputRef.current.click()} size="small">
          <PhotoCamera />
        </IconButton>

        <TextField
          fullWidth
          size="small"
          placeholder="Write a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), handleSend())
          }
          multiline
          maxRows={4}
        />

        <IconButton color="primary" onClick={handleSend} disabled={sending}>
          <Send />
        </IconButton>
      </div>
    </div>
  );
}
