"use client";
import {
  feedPosts,
  followSuggetion,
  suggetionFriends,
  unfollowSuggestion,
} from "@/redux/Slices/postSlice";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, Avatar, TextField, Button } from "@mui/material";
import { AddAPhoto } from "@mui/icons-material";
import PostCard from "@/components/Post";
import { useEffect } from "react";
import SkeletonChildren from "@/components/skelatons";
import { deslikeFeedPost, likeFeedPost } from "@/redux/Slices/postSlice";
import RightSidebar from "@/components/rightSidebar";

export default function HomePage() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.feedPosts);
  const suggestions = useSelector((state) => state.post.suggetionFriends);

  useEffect(() => {
    dispatch(feedPosts());
    dispatch(suggetionFriends());
  }, [dispatch]);

  function handelLike(post) {
    if (post.user_has_liked) {
      dispatch(deslikeFeedPost(post.post_id));
    } else {
      dispatch(likeFeedPost(post.post_id));
    }
  }

  function handelFollow(user) {
    if (user.has_followed) {
      dispatch(unfollowSuggestion(user.user_id));
    } else {
      dispatch(followSuggetion(user.user_id));
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1D1F]">
      <div className="max-w-6xl mx-auto flex justify-center gap-10 p-6">
        {/* ================= MAIN FEED (Centered) ================= */}
        <main className="w-full max-w-[600px] space-y-6">
          <div
            className="flex flex-col"
            style={{ width: "100%", height: "100%" }}
          >
            {posts.length !== 0 ? (
              posts?.data.map((post, key) => (
                <PostCard handelLike={handelLike} key={key} post={post} />
              ))
            ) : (
              <SkeletonChildren />
            )}
          </div>
        </main>

        {/* ================= RIGHT SIDEBAR (Fixed) ================= */}
        <RightSidebar suggestions={suggestions} handelFollow={handelFollow} />
      </div>
    </div>
  );
}
