"use client";
import React from "react";
import { Typography, Paper, Switch } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "@/lib/api";

export default function AccountTab() {
  const [isPrivate, setIsPrivate] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const is_private = userInfo?.user?.is_private;
  useEffect(() => {
    setIsPrivate(is_private??false);
  }, [is_private]);

  function onChange() {
    api.put("/profile/changePrivacy", {
      is_private: isPrivate,
    });
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <Paper
        elevation={0}
        className="border border-[var(--card-border)] bg-[var(--card-bg)] rounded-3xl overflow-hidden shadow-sm transition-colors duration-300"
      >
        <div className="bg-[var(--nav-pill-bg)] px-6 py-4 border-b border-[var(--card-border)] transition-colors duration-300">
          <Typography className="font-extrabold text-lg">
            Account Privacy
          </Typography>
        </div>
        <div className="p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--nav-pill-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--color-primary)]">
              <LockOutlinedIcon />
            </div>
            <div>
              <Typography className="font-bold text-[var(--text-primary)]">
                Private Account
              </Typography>
              <Typography className="text-sm text-[var(--text-muted)]">
                Only approved people can see your content.
              </Typography>
            </div>
          </div>
          <Switch
            checked={isPrivate}
            onChange={(e) => {
              const value = e.target.checked;
              setIsPrivate(value);
              api.put("/profile/changePrivacy", {
                is_private: value,
              });
            }}
            color="primary"
          />
        </div>
      </Paper>
    </div>
  );
}
