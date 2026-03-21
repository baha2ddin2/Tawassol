import React, { useState, useEffect } from "react";
import { Avatar, TextField, IconButton } from "@mui/material";
import { Check, DoneAll, Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function GroupMessage({
  message,
  messagesData,
  index,
  dayjs,
  userId,
  handelDelete,
  handelUpdate, 
}) {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);

  useEffect(() => {
    setEditValue(message.content);
  }, [message.content]);

  const isMe = message.sender_id === userId;
  const prevMsg = messagesData?.[index - 1];
  const isSameAsPrev = prevMsg?.sender_id && prevMsg.sender_id === message.sender_id;
  const showHeader = !isSameAsPrev && !isMe;

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!isMe) return;
    setShowMenu(true);
  };

  const handleUpdateClick = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(message.content);
  };

  const onSave = () => {
    handelUpdate(message.message_id, editValue);
    setIsEditing(false);
  };

  let attachments = [];
  try {
    if (Array.isArray(message.media)) {
      attachments = message.media;
    } else if (typeof message.media === "string") {
      attachments = JSON.parse(message.media);
    } else if (message.media) {
      attachments = Array.isArray(message.media) ? message.media : [message.media];
    }
  } catch (e) {
    attachments = [];
  }

  return (
    <div
      className={`flex flex-col ${isMe ? "items-end" : "items-start"} ${!isSameAsPrev ? "mt-4" : "mt-0.5"} relative`}
      onClick={() => setShowMenu(false)}
    >
      {showHeader && (
        <span className="text-[11px] font-bold text-blue-600 ml-10 mb-1">
          {message.display_name}
        </span>
      )}

      <div
        className={`flex items-end gap-2 max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"}`}
      >
        {!isMe ? (
          <div className="w-8">
            {!isSameAsPrev ? (
              <Avatar
                src={`http://127.0.0.1:8000/storage/${message.avatar_url}`}
                sx={{ width: 32, height: 32 }}
              />
            ) : null}
          </div>
        ) : null}

        <div
          onContextMenu={handleContextMenu}
          className={`px-3 py-2 rounded-2xl text-sm shadow-sm relative transition-colors duration-300
                  ${isEditing ? "bg-[#e2e8f0] dark:bg-[#081F5C] text-black dark:text-[#F9FCFF] border border-transparent dark:border-[#334EAC]" : isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--card-border)] rounded-tl-none"}
                  ${isSameAsPrev ? (isMe ? "rounded-tr-2xl" : "rounded-tl-2xl") : ""} 
                `}
        >
          {isEditing ? (
            <div className="flex flex-col gap-2 min-w-[200px]">
              <TextField
                fullWidth
                multiline
                size="small"
                variant="standard"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
                sx={{
                  "& .MuiInputBase-root": { color: "inherit", fontSize: '14px' },
                  "& .MuiInput-underline:before": { borderBottomColor: "currentColor" },
                  "& .MuiInput-underline:after": { borderBottomColor: "var(--color-primary)" },
                }}
              />
              <div className="flex justify-end gap-1 mt-1">
                <IconButton size="small" onClick={handleCancel} sx={{ color: "var(--danger)" }}>
                  <Close fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={onSave} sx={{ color: "#709601" }}>
                  <Check fontSize="small" />
                </IconButton>
              </div>
            </div>
          ) : (
            <>
              {message.content && <div className="whitespace-pre-wrap">{message.content}</div>}

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
            </>
          )}

          <div className="flex items-center justify-end space-x-1 mt-1">
            <div className={`text-[9px] ${isMe ? "text-blue-100" : "text-gray-400"}`}>
              {dayjs(message.created_at).format("HH:mm")}
            </div>
          </div>

          {/* Dropdown menu */}
          {showMenu && (
            <div className={`absolute top-0 flex flex-col items-stretch ${isMe ? "right-full mr-2" : "left-full ml-2"} mt-2 w-32 bg-white dark:bg-[#081F5C] text-gray-800 dark:text-[#F9FCFF] shadow-xl border border-transparent dark:border-[#334EAC] rounded-md z-50 overflow-hidden transition-colors duration-300`}>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#334EAC] text-xs transition-colors"
                onClick={(e) => { e.stopPropagation(); handleUpdateClick(); }}
              >
                {t("messages.edit", "Edit")}
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#334EAC] text-red-500 text-xs transition-colors"
                onClick={(e) => { e.stopPropagation(); handelDelete(message.message_id); }}
              >
                {t("messages.delete", "Delete")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
