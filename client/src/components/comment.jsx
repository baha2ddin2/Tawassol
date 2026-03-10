"use client";

import React from "react";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { Avatar, IconButton, Typography } from '@mui/material';
import { MoreHoriz, FavoriteBorder, Favorite } from '@mui/icons-material';

dayjs.extend(relativeTime);

export default function Comment({ comment }) {

  const isLiked = comment.user_like; 
  const time =dayjs(comment.created_at).fromNow()

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
              <p component={'p'} className="text-[#94a3b8] text-[10px] uppercase font-bold  tracking-tight">
                {time}
              </p>
            </div>
            <IconButton size="small" className="text-slate-400">
              <MoreHoriz fontSize="small" />
            </IconButton>
          </div>

          <div className="mt-2 pr-2">
            <Typography className="text-[#334155] text-[15px] leading-relaxed">
              {comment.content}
            </Typography>
          </div>

          <div className="mt-3 flex items-center gap-4">
            <button className="flex items-center gap-1.5 group">
              <div className={`p-1.5 rounded-full transition-colors ${isLiked ? 'bg-red-50' : 'group-hover:bg-red-50'}`}>
                {isLiked ? (
                  <Favorite className="text-red-500" sx={{ fontSize: 18 }} />
                ) : (
                  <FavoriteBorder className="text-slate-400 group-hover:text-red-500" sx={{ fontSize: 18 }} />
                )}
              </div>
              <span className={`text-xs font-bold ${isLiked ? 'text-red-500' : 'text-slate-500 group-hover:text-red-500'}`}>
                {comment.likes_count || 0}
              </span>
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}