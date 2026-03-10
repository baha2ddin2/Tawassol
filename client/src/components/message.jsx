import { useState } from "react";
import { Check,DoneAll } from "@mui/icons-material";

export default function Message({ message, userId, dayjs }) {
  const [showMenu, setShowMenu] = useState(false);

  const time = dayjs(message.created_at).format("HH:mm");
  const isMe =
    message.is_user === 1 || message.is_user === true || message.sender_id === userId;

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
    if(!isMe) return
    setShowMenu(true);
  };

  const handleClickOutside = () => {
    setShowMenu(false);
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} relative`} onClick={handleClickOutside}>
      <div
        className={`${isMe ? "bg-blue-500 text-white" : "bg-white text-gray-800 shadow"} px-3 py-2 rounded-xl max-w-[85%]`}
        onContextMenu={handleContextMenu}
        onTouchStart={(e) => e.touches.length === 1 && setTimeout(() => handleContextMenu(e), 600)} // Mobile long press ~600ms
      >
        {message.content && (
          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
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

        <div className="flex items-center justify-end space-x-1 mt-2 text-[10px]">
          <span className={`${isMe ? "text-blue-100/90" : "text-gray-400"}`}>{time}</span>
          {isMe && (
            <span className="text-[10px]">
              {message.is_read ?<DoneAll/> : <Check/>}
            </span>
          )}
        </div>

        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute top-0 right-0 mt-8 w-40 bg-white text-blue-950 shadow-lg rounded-md z-50">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">update</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}