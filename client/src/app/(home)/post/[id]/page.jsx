'use client'
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import SendIcon from "@mui/icons-material/Send";
import {
  Typography,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import PostCard from "@/components/Post";
import Comment from "@/components/Comment";
import {
  comments,
  postById,
  likePost,
  deslikePost,
  addComment
} from "@/redux/Slices/postSlice";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [commentText, setCommentText] = useState("");
  const observerTarget = useRef(null);

  const post = useSelector((state) => state.post.postById);
  const commentList = useSelector((state) => state.post.comments);
  const { data: commentsData, current_page, last_page, total } = commentList || {};
  const loadingComments = useSelector((state) => state.post.loadingComments);

  // 1. Initial Load
  useEffect(() => {
    if (id) {
      dispatch(postById(id));
      dispatch(comments({ postId: id, page: 1 }));
    }
  }, [id, dispatch]);

  // 2. Observer Logic for Pagination
  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && current_page < last_page && !loadingComments) {
        dispatch(comments({ postId: id, page: current_page + 1 }));
      }
    },
    [dispatch, id, current_page, last_page, loadingComments]
  );

  useEffect(() => {
    const element = observerTarget.current;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });

    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  const handleLike = (postItem) => {
    if (postItem.user_has_liked) {
      dispatch(deslikePost(postItem.post_id));
    } else {
      dispatch(likePost(postItem.post_id));
    }
  };

  const handleAddComment = () => {
    if (commentText.trim() === "") return;
    dispatch(addComment({ postId: id, content: commentText }));
    setCommentText("");
  };

  if (!post)
    return (
      <div className="flex justify-center pt-20">
        <CircularProgress size={30} sx={{ color: "#1477ff" }} />
      </div>
    );

  return (
    <main className="min-h-screen bg-[var(--background)] pb-10 transition-colors duration-300">
      <div className="max-w-[650px] mx-auto pt-6 px-4">
        {/* The Main Post */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border flex justify-center items-center border-[var(--card-border)] overflow-hidden transition-colors duration-300">
          <PostCard post={post} handelLike={handleLike} />
        </div>

        {/* Discussion Header */}
        <div className="mt-8 mb-4 flex items-center gap-4 px-2">
          <Typography className="font-black text-lg text-[var(--text-primary)]">
            {t("posts.discussion", "Discussion")}
          </Typography>
          <div className="h-[1px] flex-grow bg-[var(--card-border)]" />
          <Typography className="text-sm font-bold text-[var(--text-muted)]">
            {total || commentsData?.length || 0} {t("posts.commentsCount", "Comments")}
          </Typography>
        </div>

        {/* Comments List */}
        {/* ADDED pb-32 so the list scrolls past the fixed input! */}
        <div className="space-y-3 pb-32">
          {commentsData?.length > 0 ? (
            <>
              {commentsData.map((com) => (
                <Comment key={com.comment_id} comment={com} />
              ))}
              
              {/* TRIGGER ELEMENT */}
              <div ref={observerTarget} className="py-4 w-full flex justify-center">
                {current_page < last_page && (
                  <CircularProgress size={24} sx={{ color: "#64748b" }} />
                )}
                {current_page >= last_page && commentsData.length > 5 && (
                  <Typography className="text-sm text-[var(--text-muted)]">
                    {t("posts.noMoreComments", "No more comments.")}
                  </Typography>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-10 bg-[var(--card-bg)] rounded-2xl border border-dashed border-[var(--card-border)]">
              <Typography className="text-[var(--text-muted)] font-medium">
                {t("posts.noCommentsYet", "No comments yet. Be the first to share your thoughts!")}
              </Typography>
            </div>
          )}
        </div>

        <div className="fixed bottom-4 max-sm:bottom-17 right-4 left-0 flex justify-end items-center gap-2 max-w-[650px] mx-auto px-4 z-10">
          <div className="bg-[var(--card-bg)] shadow-lg rounded-full p-1 flex items-center w-full border border-[var(--card-border)] transition-colors duration-300">
            <TextField
              fullWidth
              placeholder={t("posts.writeComment", "Write a comment...")}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { px: 2, py: 1, color: "var(--text-primary)" }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              sx={{
                marginRight:1,
                minWidth: 0,
                width: 40,
                height: 40,
                borderRadius: "50%",
                boxShadow: "none",
              }}
            >
              <SendIcon sx={{ fontSize: 18 }} />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
