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
import { followFollowingByUser, followingByUser, unfollowFollowingByUser } from "@/redux/Slices/profileSlice";
import { useParams, useRouter } from "next/navigation";
import { followSuggetion, unfollowSuggestion } from "@/redux/Slices/postSlice";

export default function FollowingPage() {
  const router =useRouter()
  const {id}=useParams()
  const dispatch = useDispatch();
  const followingData = useSelector((state) => state.profile.followingByUser);  
  const user =useSelector((data)=>data.auth.userInfo.user)
  const user_id =user?.user_id
  useEffect(() => {
    dispatch(followingByUser(id));
  }, [dispatch,id]);

  function handelFollow(userId){
    dispatch(followSuggetion(userId))
    dispatch(followFollowingByUser(userId))
  }

  function Handelunfollow(userId){
    dispatch(unfollowSuggestion(userId))
    dispatch(unfollowFollowingByUser(userId))
  }
  
  return (
    <div className="min-h-screen bg-[#f6f8fc] py-8 px-4">
      <div className="max-w-[600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <IconButton onClick={()=>router.back()} className="bg-white border border-[#e7edf7] shadow-sm">
              <ArrowBackIcon />
            </IconButton>
            <Typography className="font-black text-2xl text-[#0f172a]">
              Following
            </Typography>
          </div>
        </div>

        <Paper
          elevation={0}
          className="border border-[#e7edf7] rounded-[24px] overflow-hidden bg-white shadow-sm"
        >
          <div className="p-4 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2 bg-[#f1f5f9] px-4 py-2 rounded-xl">
              <SearchIcon className="text-[#94a3b8]" />
              <InputBase
                placeholder="Search following..."
                className="w-full font-semibold text-sm"
              />
            </div>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {followingData &&
              followingData.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-4 hover:bg-[#fcfdfe]"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={`http://127.0.0.1:8000/storage/${user.avatar_url}`}
                      className="w-12 h-12 border-2 border-white shadow-sm bg-slate-200 text-slate-700 font-bold"
                    >
                      {user.display_name[0]}
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <Typography className="font-extrabold text-[#0f172a] text-[15px]">
                          {user.display_name}
                        </Typography>
                      </div>
                    </div>
                  </div>

                 {user_id === user.user_id && (!user.has_followed ? (
                    <Button
                      onClick={()=>handelFollow(user.user_id)}
                      variant="contained"
                      size="small"
                      className="bg-[#1477ff] rounded-full normal-case font-bold px-4 shadow-none"
                    >
                      Follow
                    </Button>
                  ) : (
                    <Button
                      onClick={()=>Handelunfollow(user.user_id)}
                      variant="outlined"
                      size="small"
                      className="border-[#e2e8f0] text-[#64748b] rounded-full normal-case font-bold px-4"
                    >
                      Following
                    </Button>
                  ))}
                </div>
              ))}
          </div>
        </Paper>
      </div>
    </div>
  );
}
