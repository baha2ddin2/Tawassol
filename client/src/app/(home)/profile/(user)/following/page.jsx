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
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useDispatch, useSelector } from "react-redux";
import { followFollowingUser, following, unfollowFollowingUser } from "@/redux/Slices/profileSlice";
import { useRouter } from "next/navigation";
import { followSuggetion, unfollowSuggestion } from "@/redux/Slices/postSlice";
import { useTranslation } from "react-i18next";

export default function FollowingPage() {
  const router = useRouter()
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const followingData = useSelector((state) => state.profile.following);
  useEffect(() => {
    dispatch(following());
  }, []);

    function handelFollow(userId){
      dispatch(followSuggetion(userId))
      dispatch(followFollowingUser(userId))
    }
  
    function handelunfollow(userId){
      dispatch(unfollowSuggestion(userId))
      dispatch(unfollowFollowingUser(userId))
    }
  return (
    <div className="min-h-screen bg-[#F9FCFF] dark:bg-[#081F5C] py-8 px-4 transition-colors duration-300">
      <div className="max-w-[600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <IconButton onClick={()=>router.back()} className="bg-white dark:bg-[#334EAC] border border-[#e7edf7] dark:border-[#334EAC] shadow-sm text-slate-800 dark:text-[#F9FCFF] transition-colors">
              <ArrowBackIcon />
            </IconButton>
            <Typography className="font-black text-2xl text-[#0f172a] dark:text-[#F9FCFF] transition-colors">
              {t("profile.followingTitle", "Following")}
            </Typography>
          </div>
          <IconButton className="dark:text-[#D0E3FF] transition-colors">
            <SettingsOutlinedIcon />
          </IconButton>
        </div>

        <Paper
          elevation={0}
          className="border border-[#e7edf7] dark:border-[#334EAC] rounded-[24px] overflow-hidden bg-white dark:bg-[#081F5C] shadow-sm transition-colors"
        >
          <div className="p-4 border-b border-[#f1f5f9] dark:border-[#334EAC] transition-colors">
            <div className="flex items-center gap-2 bg-[#f1f5f9] dark:bg-[#334EAC] px-4 py-2 rounded-xl transition-colors">
              <SearchIcon className="text-[#94a3b8] dark:text-[#D0E3FF]" />
              <InputBase
                placeholder={t("profile.searchFollowing", "Search following...")}
                className="w-full font-semibold text-sm dark:text-[#F9FCFF]"
              />
            </div>
          </div>

          <div className="divide-y divide-[#f1f5f9] dark:divide-[#334EAC] transition-colors">
            {followingData &&
              followingData.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-4 hover:bg-[#fcfdfe] dark:hover:bg-[#334EAC] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={`http://127.0.0.1:8000/storage/${user.avatar_url}`}
                      className="w-12 h-12 border-2 border-white dark:border-[#081F5C] shadow-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-[#D0E3FF] font-bold transition-colors"
                    >
                      {user.display_name[0]}
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <Typography className="font-extrabold text-[#0f172a] dark:text-[#F9FCFF] text-[15px] transition-colors">
                          {user.display_name}
                        </Typography>
                      </div>
                    </div>
                  </div>

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
                      className="border-[#e2e8f0] dark:border-[#334EAC] text-[#64748b] dark:text-[#D0E3FF] rounded-full normal-case font-bold px-4 transition-colors"
                    >
                      {t("profile.followingButton", "Following")}
                    </Button>
                  )}
                </div>
              ))}
          </div>
        </Paper>
      </div>
    </div>
  );
}
