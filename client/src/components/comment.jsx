"use client";

import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Avatar, IconButton, Typography } from "@mui/material";
import { MoreHoriz, FavoriteBorder, Favorite } from "@mui/icons-material";
import Dropdown from "./DropDown";
import { useDispatch, useSelector } from "react-redux";
import { deslikeComment, likeComment } from "@/redux/Slices/postSlice";

dayjs.extend(relativeTime);

export default function Comment({ comment }) {
  const isLiked = comment.user_has_liked;
  const time = dayjs(comment.created_at).fromNow();
  const user =useSelector((data)=>data.auth.userInfo.user)
  const dispatch=useDispatch()
  
  return (
    <div className="bg-[var(--card-bg)] p-4 rounded-2xl shadow-none text-[var(--text-primary)] transition-colors duration-300">
      <div className="flex gap-3">
        <Avatar
          src={`http://127.0.0.1:8000/storage/${comment.avatar_url}`}
          className="w-10 h-10 border border-[var(--card-border)] shadow-sm"
        />

        <div className="flex-grow flex flex-col">
          <div className="flex justify-between items-start bg-[var(--hover-overlay)] p-3 rounded-2xl rounded-tl-none relative border border-transparent dark:border-[var(--card-border)]">
            <div>
              <Typography className="font-bold text-[14px] hover:text-[var(--color-primary)] cursor-pointer text-[var(--text-primary)]">
                {comment.display_name}
              </Typography>
              <Typography className="text-[13px] leading-relaxed mt-1 mb-1 whitespace-pre-wrap text-[var(--text-primary)]">
                {comment.content}
              </Typography>
            </div>
            
            <div className="self-start flex items-center -mt-1 -mr-1">
              <IconButton size="small" className="text-[var(--text-muted)]">
                <Dropdown isAuthor={comment.author_id === user?.user_id} commentId={comment.comment_id}>
                  <MoreHoriz fontSize="small" />
                </Dropdown>
              </IconButton>
            </div>
          </div>

          {/* Action Row Bottom */}
          <div className="flex items-center gap-4 mt-2 px-2">
            <span className="text-[var(--text-muted)] text-[12px] font-medium tracking-tight uppercase">
              {time}
            </span>
            <button className="flex items-center gap-1.5 p-1 -ml-1 rounded-full transition-colors hover:bg-red-50 dark:hover:bg-red-900/30 group cursor-pointer" onClick={() => isLiked ? dispatch(deslikeComment(comment.comment_id)) : dispatch(likeComment(comment.comment_id))}>
              {isLiked ? (
                <Favorite className="text-red-500" sx={{ fontSize: 16 }} />
              ) : (
                <FavoriteBorder className="text-[var(--text-muted)] group-hover:text-red-500 transition-colors" sx={{ fontSize: 16 }} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
