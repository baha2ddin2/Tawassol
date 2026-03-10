"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import SendIcon from '@mui/icons-material/Send';
import {
  Divider,
  Typography,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import PostCard from "@/components/Post";
import Comment from "@/components/comment";
import {
  comments,
  postById,
  likePost,
  deslikePost,
  // addComment // <-- Make sure you have this action in your reducer
} from "@/redux/reducers/postReducer";

export default function Page() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(postById(id));
      dispatch(comments(id));
    }
  }, [id, dispatch]);

  const post = useSelector((state) => state.post.postById);
  const commentList = useSelector((state) => state.post.comments);

  const handleLike = (postItem) => {
    if (postItem.user_has_liked) {
      dispatch(deslikePost(postItem.post_id));
    } else {
      dispatch(likePost(postItem.post_id));
    }
  };

  const handleAddComment = () => {
    if (commentText.trim() === "") return;
    // dispatch(addComment({ post_id: id, text: commentText }));
    setCommentText("");
  };

  if (!post)
    return (
      <div className="flex justify-center pt-20">
        <CircularProgress size={30} sx={{ color: "#1477ff" }} />
      </div>
    );

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="max-w-[650px] mx-auto pt-6 px-4">
        {/* The Main Post */}
        <div className="bg-white rounded-2xl shadow-sm border flex justify-center items-center border-[#e2e8f0] overflow-hidden">
          <PostCard post={post} handelLike={handleLike} />
        </div>

        {/* Discussion Header */}
        <div className="mt-8 mb-4 flex items-center gap-4 px-2">
          <Typography className="font-black text-lg text-[#0f172a]">
            Discussion
          </Typography>
          <div className="h-[1px] flex-grow bg-[#e2e8f0]" />
          <Typography className="text-sm font-bold text-[#64748b]">
            {commentList?.data?.length || 0} Comments
          </Typography>
        </div>

        {/* Comment Input */}

        {/* Comments List */}
        <div className="space-y-3">
          {commentList?.data?.length > 0 ? (
            commentList.data.map((com) => (
              <Comment key={com.comment_id} comment={com} />
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
              <Typography className="text-slate-400 font-medium">
                No comments yet. Be the first to share your thoughts!
              </Typography>
            </div>
          )}
        </div>
        <div className="fixed bottom-4 right-4 left-0 flex justify-end items-center gap-2 max-w-[650px] mx-auto px-4">
          <TextField
            fullWidth
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: "white",
              borderRadius: "999px",
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComment}
            disabled={!commentText.trim()}
            sx={{
              minWidth: 0,
              padding: "10px",
              borderRadius: "50%",
            }}
          >
            <SendIcon />
          </Button>
        </div>
      </div>
    </main>
  );
}
