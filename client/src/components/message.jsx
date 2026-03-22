import { useEffect, useState } from "react";
import { Check, DoneAll, Close } from "@mui/icons-material";
import { TextField, IconButton } from "@mui/material"
import { useInView } from "react-intersection-observer";
import { useDispatch } from "react-redux";
import { seenMessage } from "@/redux/Slices/messageSlice";
import { useTranslation } from "react-i18next";

export default function Message({
  message,
  userId,
  dayjs,
  handelDelete,
  handleUpdate,
}) {
  const {ref,inView}=useInView({
    threshold:0.7,
    triggerOnce:true
  })
  const dispatch = useDispatch()
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);

  useEffect(() => {
    setEditValue(message.content);
  }, [message.content]);

  const time = dayjs(message.created_at).format("HH:mm");
  const isMe =
    message.is_user === 1 ||
    message.is_user === true ||
    message.sender_id === userId;

  useEffect(()=>{
    if(message.is_read) return
    if(inView){
      dispatch(seenMessage(message.message_id))
    }
  },[inView])
  
  const handleUpdateClick = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(message.content); 
  };

  const onSave = () => {
    handleUpdate(message.message_id, editValue);
    setIsEditing(false);
  };

  let attachments = [];
  try {
    if (Array.isArray(message.media)) {
      attachments = message.media;
    } else if (typeof message.media === "string") {
      attachments = JSON.parse(message.media);
    } else if (message.media) {
      attachments = Array.isArray(message.media)
        ? message.media
        : [message.media];
    }
  } catch (e) {
    attachments = [];
  }

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!isMe) return;
    setShowMenu(true);
  };

  const handleClickOutside = () => {
    setShowMenu(false);
  };


  return (
    <div
      ref={ref}
      className={`flex ${isMe ? "justify-end" : "justify-start"} relative`}
      onClick={handleClickOutside}
    >
      <div
        className={`${isEditing ? "bg-[#e2e8f0] dark:bg-[#334EAC] text-black dark:text-[#F9FCFF] border border-transparent dark:border-[#334EAC]" : isMe ? "bg-blue-500 text-white" : "bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--card-border)] shadow-sm"} px-3 py-2 rounded-xl max-w-[85%] transition-colors duration-300`}
        onContextMenu={handleContextMenu}
        onTouchStart={(e) =>
          e.touches.length === 1 && setTimeout(() => handleContextMenu(e), 600)
        }
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
                input: { color: "inherit" },
                "& .MuiInputBase-root": { color: "inherit" },
                "& .MuiInput-underline:before": { borderBottomColor: "currentColor" },
                "& .MuiInput-underline:after": { borderBottomColor: "#709601" },
              }}
            />
            <div className="flex justify-end gap-1">
              <IconButton size="small" onClick={handleCancel} className="text-gray-500 dark:text-[#D0E3FF] transition-colors">
                <Close fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={onSave} className="text-[#709601] transition-colors">
                <Check fontSize="small" />
              </IconButton>
            </div>
          </div>
        ) : (
          <>
            {message.content && (
              <div className="whitespace-pre-wrap text-sm">
                {message.content}
              </div>
            )}

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
        <div className="flex items-center justify-end space-x-1 mt-2 text-[10px]">
          <span className={`${isMe ? "text-blue-100/90" : "text-gray-400"}`}>
            {time}
          </span>
          {isMe && (
            <span className="text-[10px]">
              {message.is_read ? <DoneAll /> : <Check />}
            </span>
          )}
        </div>

        {showMenu && (
          <div className="absolute top-0 right-0 mt-8 w-40 bg-white dark:bg-[#334EAC] text-blue-950 dark:text-[#F9FCFF] border border-gray-100 dark:border-transparent shadow-lg rounded-md z-50 overflow-hidden transition-colors duration-300">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#081F5C] transition-colors"
              onClick={handleUpdateClick}
            >
              {t("messages.edit", "Edit")}
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#081F5C] text-red-500 dark:text-red-400 transition-colors"
              onClick={() => handelDelete(message.message_id)}
            >
              {t("messages.delete", "Delete")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
