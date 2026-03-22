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
import { followers, followersByUser, followFollowersByUser, unfollowFollowersByUser } from "@/redux/Slices/profileSlice";
import { followSuggetion,unfollowSuggestion } from "@/redux/Slices/postSlice";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function FollowersPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  useEffect(() => {
    dispatch(followersByUser(id));
  }, [dispatch, id]);
  const router = useRouter();
  const followersData = useSelector((state) => state.profile.followersByUser);
  const user = useSelector((data) => data.auth.userInfo.user);
  const user_id = user?.user_id;

  function handelFollow(userId) {
    dispatch(followSuggetion(userId));
    dispatch(followFollowersByUser(userId));
  }

  function handelunfollow(userId) {
    dispatch(unfollowSuggestion(userId));
    dispatch(unfollowFollowersByUser(userId));
  }
  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 transition-colors duration-300">
      <div className="max-w-[600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <IconButton
              onClick={() => router.back()}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm text-[var(--text-primary)] transition-colors duration-300"
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography className="font-black text-2xl text-[var(--text-primary)] transition-colors duration-300">
              {t("profile.followers", "Followers")}
            </Typography>
          </div>
          <Typography className="font-bold text-[var(--text-muted)] transition-colors duration-300">
            {followers ? followersData?.length : 0} {t("profile.total", "Total")}
          </Typography>
        </div>

        <Paper
          elevation={0}
          className="border border-[var(--card-border)] rounded-[24px] overflow-hidden bg-[var(--card-bg)] shadow-sm transition-colors duration-300"
        >
          <div className="p-4 border-b border-[var(--card-border)] transition-colors duration-300">
            <div className="flex items-center gap-2 bg-[var(--nav-pill-bg)] px-4 py-2 rounded-xl transition-colors duration-300">
              <SearchIcon className="text-[var(--text-muted)]" />
              <InputBase
                placeholder={t("profile.searchFollowers", "Search followers...")}
                className="w-full font-semibold text-sm text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="divide-y divide-[var(--card-border)] transition-colors duration-300">
            {followersData &&
              followersData?.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-4 hover:bg-[var(--hover-overlay)] transition-colors duration-300"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={user.avatar_url ? `http://127.0.0.1:8000/storage/${user.avatar_url}` : undefined}
                      className="w-12 h-12 border-2 border-[var(--card-bg)] shadow-sm bg-[var(--nav-pill-bg)] text-blue-500 font-bold transition-colors duration-300"
                    >
                      {user.display_name[0]}
                    </Avatar>
                    <div>
                      <Typography className="font-extrabold text-[var(--text-primary)] text-[15px] transition-colors duration-300">
                        {user.display_name}
                      </Typography>
                    </div>
                  </div>

                    <div className="flex items-center gap-2">
                    {user_id !== user.user_id &&
                      (!user.has_followed ? (
                        <Button
                          onClick={()=>handelFollow(user.user_id)}
                          variant="contained"
                          size="small"
                          className="bg-[#1477ff] rounded-full normal-case font-bold px-4 shadow-none"
                        >
                          {t("profile.follow", "Follow")}
                        </Button>
                      ) : (
                        <Button
                          onClick={()=>handelunfollow(user.user_id)}
                          variant="outlined"
                          size="small"
                          className="border-[var(--card-border)] text-[var(--text-muted)] rounded-full normal-case font-bold px-4 transition-colors duration-300"
                        >
                          {t("profile.followingButton", "Following")}
                        </Button>
                      ))}
                    <IconButton size="small" className="text-[var(--text-muted)]">
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
