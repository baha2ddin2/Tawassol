"use client";

import { useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import { deslikeHashtagPost, hashtagCount, hashtagPosts, likeHashtagPost } from "@/redux/Slices/hashtagSlice";
import { likePost, deslikePost } from "@/redux/Slices/postSlice";
import PostCard from "@/components/Post";

export default function HashtagPage() {
  const { tag } = useParams();
  const dispatch = useDispatch();
  const observerTarget = useRef(null);

  const count = useSelector((state) => state.hashtag.hashtagCount);
  const postsState = useSelector((state) => state.hashtag.hashtagPosts);
  const loading = useSelector((state) => state.hashtag.loadingHashtagPosts);

  const { data: postsData, current_page, last_page } = postsState || {};

  useEffect(() => {
    if (tag) {
      const decodedTag = decodeURIComponent(tag);
      dispatch(hashtagPosts({ tag: decodedTag, page: 1 }));
      dispatch(hashtagCount(decodedTag));
    }
  }, [tag, dispatch]);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && current_page < last_page && !loading) {
        const decodedTag = decodeURIComponent(tag);
        dispatch(hashtagPosts({ tag: decodedTag, page: current_page + 1 }));
      }
    },
    [dispatch, tag, current_page, last_page, loading]
  );

  useEffect(() => {
    const element = observerTarget.current;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });

    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  const handleLike = (post) => {
    if (post.user_has_liked) {
      dispatch(deslikePost(post.post_id));
      dispatch(deslikeHashtagPost(post.post_id));
    } else {
      dispatch(likePost(post.post_id));
      dispatch(likeHashtagPost(post.post_id));
    }
  };

  if (!postsState) {
    return (
      <Box className="flex justify-center pt-20">
        <CircularProgress size={30} sx={{ color: "#1477ff" }} />
      </Box>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] pb-20 transition-colors duration-300">
      <Box className="bg-[var(--card-bg)] border-b border-[var(--card-border)] pt-10 pb-6 px-4 mb-6 transition-colors duration-300">
        <div className="max-w-[650px] mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-[var(--nav-pill-bg)] flex items-center justify-center text-[var(--color-primary)] shadow-sm border border-[var(--card-border)]">
            <TagIcon sx={{ fontSize: 40 }} />
          </div>
          <div>
            <Typography
              variant="h4"
              className="font-black text-[var(--text-primary)] tracking-tighter"
            >
              #{count?.hashtag || decodeURIComponent(tag)}
            </Typography>
            <Typography className="text-[var(--text-muted)] font-bold text-sm uppercase tracking-wide">
              {count?.total_posts || 0} Posts using this tag
            </Typography>
          </div>
        </div>
      </Box>

      <div className="max-w-[650px] mx-auto px-4 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Typography className="font-black text-sm text-[var(--text-muted)] uppercase tracking-widest">
            Recent Activity
          </Typography>
          <div className="h-[1px] flex-grow bg-[var(--card-border)]" />
        </div>

        {postsData?.length > 0 ? (
          <>
            {postsData.map((post) => (
              <div
                key={post.post_id}
                className="bg-[var(--card-bg)] rounded-2xl shadow-sm border flex justify-center border-[var(--card-border)] overflow-hidden transition-colors duration-300"
              >
                <PostCard post={post} handelLike={handleLike} />
              </div>
            ))}
            
            {/* TRIGGER ELEMENT */}
            <div ref={observerTarget} className="py-6 flex justify-center w-full">
              {current_page < last_page && (
                <CircularProgress size={24} sx={{ color: "#1477ff" }} />
              )}
              {current_page >= last_page && postsData.length > 5 && (
                <Typography className="text-sm text-[var(--text-muted)]">
                  You've reached the end of this hashtag.
                </Typography>
              )}
            </div>
          </>
        ) : (
          <Paper
            variant="outlined"
            className="p-12 text-center rounded-3xl border-dashed border-[var(--card-border)] bg-[var(--card-bg)]"
          >
            <Typography className="text-[var(--text-muted)] font-medium">
              No posts found with this hashtag yet.
            </Typography>
          </Paper>
        )}
      </div>
    </main>
  );
}
