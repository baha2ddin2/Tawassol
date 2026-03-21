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
    <div className="bg-white p-4 rounded-2xl border border-[#eef2f6] shadow-sm transition-all hover:border-blue-100">
      <div className="flex gap-3">
        <Avatar
          src={`http://127.0.0.1:8000/storage/${comment.avatar_url}`}
          className="w-10 h-10 border border-slate-100 shadow-sm"
        />

        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <Typography className="font-black text-[14px] text-[#0f172a] hover:text-blue-600 cursor-pointer">
                {comment.display_name}
              </Typography>
              <p
                className="text-[#94a3b8] text-[10px] uppercase font-bold  tracking-tight"
              >
                {time}
              </p>
            </div>
            <IconButton size="small" className="text-slate-400">
              <Dropdown isAuthor={comment.author_id ===user?.user_id} commentId={comment.comment_id} >
                {" "}
                <MoreHoriz fontSize="small" />
              </Dropdown>
            </IconButton>
          </div>

          <div className="mt-2 pr-2">
            <Typography className="text-[#334155] text-[15px] leading-relaxed">
              {comment.content}
            </Typography>
          </div>

          <div className="mt-3 flex items-center justify-end ">
            <button className="flex items-center gap-1.5 group">
              <div
                className={`p-1.5 rounded-full transition-colors ${isLiked ? "bg-red-50" : "group-hover:bg-red-50"}`}
              >
                {isLiked ? (
                  <Favorite onClick={()=>dispatch(deslikeComment(comment.comment_id))}  className="text-red-500" sx={{ fontSize: 18 }} />
                ) : (
                  <FavoriteBorder
                    onClick={()=>dispatch(likeComment(comment.comment_id))}
                    className="text-slate-400 group-hover:text-red-500"
                    sx={{ fontSize: 18 }}
                  />
                )}
              </div>
              <span
                className={`text-xs font-bold ${isLiked ? "text-red-500" : "text-slate-500 group-hover:text-red-500"}`}
              ></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
