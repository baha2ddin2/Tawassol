"use client";
import { Avatar } from "@mui/material";
import { Favorite, ChatBubbleOutline, PersonAdd, PostAdd } from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
dayjs.extend(relativeTime);



export default function NotificationItem({ notification }) {

  const time = dayjs(notification.created_at).fromNow();

  const renderText = () => {
    switch (notification.type) {
      case "follow":
        return (
          <>
            <span className="font-semibold">
              {notification.display_name}
            </span>{" "}
            started following you
          </>
        );

      case "like":
        return (
          <>
            <span className="font-semibold">
              {notification.display_name}
            </span>{" "}
            liked your post
          </>
        );

      case "comment":
        return (
          <>
            <span className="font-semibold">
              {notification.display_name}
            </span>{" "}
            commented on your post
          </>
        );
      case "post":
        return <>
            <span className="font-semibold">
              {notification.display_name}
            </span>{" "}
            create a new post
          </> ;

      default:
        return "New notification";
    }
  };

  const renderIcon = () => {
    switch (notification.type) {
      case "follow":
        return <PersonAdd className="text-blue-500" fontSize="small" />;

      case "like":
        return <Favorite className="text-red-500" fontSize="small" />;

      case "comment":
        return <ChatBubbleOutline className="text-green-500" fontSize="small" />;
      case "post":
        return <PostAdd/> ;

      default:
        return null;
    }
  };

  const renderHref = ()=>{
    switch (notification.type) {
      case "follow":
        console.log(notification)
        return `/profile/${notification.source_user_id}`;

      case "like":
        return`/post/${notification.post_id}`;

      case "comment":
        return `/post/${notification.post_id}`;
      case "post":
        return `/post/${notification.post_id}`;

      default:
        return null;
    }
  }

  return (
    <Link href={renderHref()} >
      <div
      className={`flex items-center gap-3 p-4 border-b hover:bg-gray-50 transition cursor-pointer ${
        !notification.is_read ? "bg-blue-50" : ""
      }`}
    >
      {/* Avatar */}
      <Avatar
        src={`http://127.0.0.1:8000/storage/${notification.avatar_url}`}
        className="w-11 h-11"
      />

      {/* Text */}
      <div className="flex-1 text-sm text-gray-800">
        <p>{renderText()}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>

      {/* Icon */}
      <div className="flex items-center gap-2">
        {renderIcon()}

        {!notification.is_read && (
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        )}
      </div>
    </div>
    </Link>
  );
}
