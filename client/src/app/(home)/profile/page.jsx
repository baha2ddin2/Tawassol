"use client";

import { Button, IconButton, Avatar } from "@mui/material";
import {
  Edit as EditIcon,
  MoreHoriz as MoreIcon,
  FavoriteBorder as HeartIcon,
  ChatBubbleOutline as ChatIcon,
  IosShare as ShareIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  deslikeProfilePost,
  likeProfilePost,
  profileInfo,
  profilePosts,
} from "@/redux/reducers/profileReducer";
import PostCard from "@/components/Post";
import Link from "next/link";

export default function ProfilePage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(profileInfo());
    dispatch(profilePosts());
  }, []);
  const infos = useSelector((state) => state.profile.profileInfo);
  const posts = useSelector((state) => state.profile.profilePosts);

  function handelLike(post) {
    if (post.user_has_liked) {
      dispatch(deslikeProfilePost(post.post_id));
    } else {
      dispatch(likeProfilePost(post.post_id));
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-[1100px] mx-auto">
        {/* Main Shell */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 p-5 md:p-8">
          {/* Profile Section */}
          {infos ? (
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-100 rounded-2xl p-6 bg-white shadow-sm">
              <div className="flex items-center gap-6">
                <Avatar
                  src={`http://127.0.0.1:8000/storage/${infos.avatar_url}`}
                  sx={{
                    width: 92,
                    height: 92,
                    border: "4px solid white",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                />
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-slate-900">
                    {infos.display_name}
                  </h1>
                  <p className="text-sm text-slate-500 max-w-md leading-relaxed">
                    {infos.bio}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <Link href={"/profile/edit-profile"}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    className="rounded-full font-bold border-slate-200 text-slate-800 normal-case hover:bg-slate-50 transition-transform active:scale-95"
                  >
                    Edit Profile
                  </Button>
                </Link>
                <IconButton className="border border-slate-200 p-2">
                  <MoreIcon />
                </IconButton>
              </div>
            </section>
          ) : null}
          {infos ? (
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-100 py-4 rounded text-center shadow-sm">
                <div className="text-xl font-black text-slate-900">
                  {infos.posts_count}
                </div>
                <div className="text-[11px] font-extrabold text-blue-500 uppercase tracking-tight">
                  posts
                </div>
              </div>
              <Link href={'/profile/following'}>
                <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-100 py-4 rounded text-center shadow-sm">
                  <div className="text-xl font-black text-slate-900">
                    {infos.following_count}
                  </div>
                  <div className="text-[11px] font-extrabold text-blue-500 uppercase tracking-tight">
                    following
                  </div>
                </div>
              </Link>
              <Link href={'/profile/followers'} >
                <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-100 py-4 rounded text-center shadow-sm">
                <div className="text-xl font-black text-slate-900">
                  {infos.followers_count}
                </div>
                <div className="text-[11px] font-extrabold text-blue-500 uppercase tracking-tight">
                  followers
                </div>
              </div>
              </Link>
            </section>
          ) : null}

          {/* Feed */}
          <section className="mt-4 flex items-center flex-col gap-4">
            {posts.data
              ? posts.data.map((post, key) => (
                  <PostCard handelLike={handelLike} key={key} post={post} />
                ))
              : null}
          </section>
        </div>
      </div>
    </main>
  );
}
