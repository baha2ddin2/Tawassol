"use client";

import React from 'react';
import { Avatar, Button, Typography, Paper, IconButton, InputBase } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const followingData = [
  { id: 1, name: "Technical Support", username: "@tawassol_help", category: "Official" },
  { id: 2, name: "Yasmine Lee", username: "@yas_lee", category: "Friend" },
  { id: 3, name: "Modern Design", username: "@ui_ux_daily", category: "Inspiration" },
];

export default function FollowingPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fc] py-8 px-4">
      <div className="max-w-[600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <IconButton className="bg-white border border-[#e7edf7] shadow-sm">
              <ArrowBackIcon />
            </IconButton>
            <Typography className="font-black text-2xl text-[#0f172a]">Following</Typography>
          </div>
          <IconButton><SettingsOutlinedIcon className="text-[#64748b]" /></IconButton>
        </div>

        <Paper elevation={0} className="border border-[#e7edf7] rounded-[24px] overflow-hidden bg-white shadow-sm">
          <div className="p-4 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2 bg-[#f1f5f9] px-4 py-2 rounded-xl">
              <SearchIcon className="text-[#94a3b8]" />
              <InputBase placeholder="Search following..." className="w-full font-semibold text-sm" />
            </div>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {followingData.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 hover:bg-[#fcfdfe]">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-white shadow-sm bg-slate-200 text-slate-700 font-bold">
                    {user.name[0]}
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <Typography className="font-extrabold text-[#0f172a] text-[15px]">{user.name}</Typography>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outlined" 
                  size="small" 
                  className="border-[#e2e8f0] text-[#0f172a] hover:bg-red-50 hover:text-red-600 hover:border-red-100 rounded-full normal-case font-bold px-5 transition-all"
                >
                  Following
                </Button>
              </div>
            ))}
          </div>
        </Paper>
      </div>
    </div>
  );
}