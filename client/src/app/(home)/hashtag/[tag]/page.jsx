"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import { hashtagCount, hashtagPosts } from "@/redux/Slices/hashtagSlice";
import { likePost, deslikePost } from "@/redux/Slices/postSlice";
import PostCard from "@/components/Post";

export default function HashtagPage() {
  const { tag } = useParams();
  const dispatch = useDispatch();

  const count = useSelector((state) => state.hashtag.hashtagCount);
  const posts = useSelector((state) => state.hashtag.hashtagPosts);

  useEffect(() => {
    if (tag) {
      const decodedTag = decodeURIComponent(tag);
      dispatch(hashtagPosts(decodedTag));
      dispatch(hashtagCount(decodedTag));
    }
  }, []);

  const handleLike = (post) => {
    if (post.user_has_liked) {
      dispatch(deslikePost(post.post_id));
    } else {
      dispatch(likePost(post.post_id));
    }
  };

  if (!posts) {
    return (
      <Box className="flex justify-center pt-20">
        <CircularProgress size={30} sx={{ color: "#1477ff" }} />
      </Box>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20">
      <Box className="bg-white border-b border-[#e2e8f0] pt-10 pb-6 px-4 mb-6">
        <div className="max-w-[650px] mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-[#1477ff] shadow-sm">
            <TagIcon sx={{ fontSize: 40 }} />
          </div>
          <div>
            <Typography
              variant="h4"
              className="font-black text-[#0f172a] tracking-tighter"
            >
              #{count?.hashtag || tag}
            </Typography>
            <Typography className="text-[#64748b] font-bold text-sm uppercase tracking-wide">
              {count?.total_posts || 0} Posts using this tag
            </Typography>
          </div>
        </div>
      </Box>

      <div className="max-w-[650px] mx-auto px-4 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Typography className="font-black text-sm text-[#94a3b8] uppercase tracking-widest">
            Recent Activity
          </Typography>
          <div className="h-[1px] flex-grow bg-[#e2e8f0]" />
        </div>

        {posts?.data?.length > 0 ? (
          posts.data.map((post) => (
            <div
              key={post.post_id}
              className="bg-white rounded-2xl shadow-sm border flex justify-center border-[#e2e8f0] overflow-hidden"
            >
              <PostCard post={post} handelLike={handleLike} />
            </div>
          ))
        ) : (
          <Paper
            variant="outlined"
            className="p-12 text-center rounded-3xl border-dashed border-slate-300"
          >
            <Typography className="text-slate-400 font-medium">
              No posts found with this hashtag yet.
            </Typography>
          </Paper>
        )}
      </div>
    </main>
  );
}
