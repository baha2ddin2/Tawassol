"use client";

import React, { useEffect } from "react";
import {
  Avatar,
  Button,
  Typography,
  Paper,
  IconButton,
  InputBase,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useDispatch, useSelector } from "react-redux";
import { followers, followFollowersUser, unfollowFollowersUser } from "@/redux/Slices/profileSlice";
import Link from "next/link";
import { followSuggetion, unfollowSuggestion } from "@/redux/Slices/postSlice";
import { useTranslation } from "react-i18next";

export default function FollowersPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(followers());
  }, []);
  const followersData = useSelector((state) => state.profile.followers);

  function handelFollow(userId) {
    dispatch(followSuggetion(userId));
    dispatch(followFollowersUser(userId));
  }

  function handelunfollow(userId) {
    dispatch(unfollowSuggestion(userId));
    dispatch(unfollowFollowersUser(userId));
  }

  return (
    <div className="min-h-screen bg-[#F9FCFF] dark:bg-[#081F5C] py-8 px-4 transition-colors duration-300">
      <div className="max-w-[600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href={"/profile"}>
              <IconButton className="bg-white dark:bg-[#334EAC] border border-[#e7edf7] dark:border-[#334EAC] shadow-sm text-slate-800 dark:text-[#F9FCFF] hover:bg-[#E7F1FF] dark:hover:bg-[#081F5C] transition-colors">
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Typography className="font-black text-2xl text-[#0f172a] dark:text-[#F9FCFF] transition-colors">
              {t("profile.followersTitle", "Followers")}
            </Typography>
          </div>
          <Typography className="font-bold text-[#64748b] dark:text-[#D0E3FF] transition-colors">
            {followers ? followersData?.length : 0} {t("profile.total", "Total")}
          </Typography>
        </div>

        <Paper
          elevation={0}
          className="border border-[#e7edf7] dark:border-[#334EAC] rounded-[24px] overflow-hidden bg-white dark:bg-[#081F5C] shadow-sm transition-colors"
        >
          <div className="p-4 border-b border-[#f1f5f9] dark:border-[#334EAC]">
            <div className="flex items-center gap-2 bg-[#f1f5f9] dark:bg-[#334EAC] px-4 py-2 rounded-xl border border-transparent dark:border-[#334EAC] transition-colors">
              <SearchIcon className="text-[#94a3b8] dark:text-[#D0E3FF]" />
              <InputBase
                placeholder={t("profile.searchFollowers", "Search followers...")}
                className="w-full font-semibold text-sm dark:text-[#F9FCFF]"
              />
            </div>
          </div>

          <div className="divide-y divide-[#f1f5f9] dark:divide-[#334EAC]">
            {followersData &&
              followersData?.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-[#081F5C] hover:bg-[#E7F1FF] dark:hover:bg-[#334EAC] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={`http://127.0.0.1:8000/storage/${user.avatar_url}`}
                      className="w-12 h-12 border-2 border-white dark:border-[#334EAC] shadow-sm bg-[#E7F1FF] dark:bg-[#334EAC] text-blue-600 dark:text-[#F9FCFF] font-bold transition-colors"
                    >
                      {user.display_name[0]}
                    </Avatar>
                    <div>
                      <Typography className="font-extrabold text-[#0f172a] dark:text-[#F9FCFF] text-[15px] transition-colors">
                        {user.display_name}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!user.has_followed ? (
                      <Button
                      onClick={()=>handelFollow(user.user_id)}
                        variant="contained"
                        size="small"
                        className="bg-[#1477ff] rounded-full normal-case font-bold px-4 shadow-none"
                      >
                        {t("profile.followBack", "Follow Back")}
                      </Button>
                    ) : (
                      <Button
                        onClick={()=>handelunfollow(user.user_id)}
                        variant="outlined"
                        size="small"
                        className="border-[#e2e8f0] dark:border-[#334EAC] text-[#64748b] dark:text-[#D0E3FF] hover:bg-[#E7F1FF] dark:hover:bg-[#334EAC] rounded-full normal-case font-bold px-4 transition-colors"
                      >
                        {t("profile.followingButton", "Following")}
                      </Button>
                    )}
                    <IconButton size="small" className="dark:text-[#D0E3FF]">
                      <MoreHorizIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
          </div>
        </Paper>
      </div>
    </div>
  );
}
