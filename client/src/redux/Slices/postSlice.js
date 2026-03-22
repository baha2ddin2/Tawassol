import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { gooeyToast } from "goey-toast";
import { notFound } from "next/navigation";

export const feedPosts = createAsyncThunk(
  "Post/feedPosts",
  async (page = 1, thunkAPI) => {
    try {
      const response = await api.get(`/feed?page=${page}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);
export const suggetionFriends = createAsyncThunk(
  "Post/sugesstion",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/suggestions");
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);
export const createPost = createAsyncThunk(
  "Post/createPost",
  async (formdata, thunkAPI) => {
    try {
      const response = await api.post("/post", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const deletePost = createAsyncThunk(
  "Post/deletePost",
  async (postId, thunkAPI) => {
    try {
      const response = await api.delete(`/post/${postId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const deleteComment = createAsyncThunk(
  "Post/deleteComment",
  async (commentId, thunkAPI) => {
    try {
      const response = await api.delete(`/comment/${commentId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const likeFeedPost = createAsyncThunk(
  "Post/likePost",
  async (postId, thunkAPI) => {
    try {
      const response = await api.post(`/like-post/${postId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const deslikeFeedPost = createAsyncThunk(
  "Post/deslikePost",
  async (postId, thunkAPI) => {
    try {
      const response = await api.delete(`/like-post/${postId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const likePost = createAsyncThunk(
  "Post/likePostById",
  async (postId, thunkAPI) => {
    try {
      const response = await api.post(`/like-post/${postId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const deslikePost = createAsyncThunk(
  "Post/deslikePostById",
  async (postId, thunkAPI) => {
    try {
      const response = await api.delete(`/like-post/${postId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);
export const followSuggetion = createAsyncThunk(
  "Post/follow",
  async (userId, thunkAPI) => {
    try {
      const response = await api.post(`/follow/${userId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const postById = createAsyncThunk(
  "Post/postById",
  async (postId, thunkAPI) => {
    try {
      const response = await api.get(`/post/${postId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const comments = createAsyncThunk(
  "Post/comments",
  async ({ postId, page = 1 }, thunkAPI) => {
    try {
      const response = await api.get(`/comment/${postId}?page=${page}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const addComment = createAsyncThunk(
  "Post/addComment",
  async ({ content, postId }, thunkAPI) => {
    try {
      const response = await api.post(`/comment/${postId}`, {
        content,
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const likeComment = createAsyncThunk(
  "Post/likeComment",
  async (commentId, thunkAPI) => {
    try {
      const response = await api.post(`/like-comment/${commentId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const deslikeComment = createAsyncThunk(
  "Post/deslikeComment",
  async (commentId, thunkAPI) => {
    try {
      const response = await api.delete(`/like-comment/${commentId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const unfollowSuggestion = createAsyncThunk(
  "Post/unfollow",
  async (userId, thunkAPI) => {
    try {
      const response = await api.delete(`/unfollow/${userId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

const PostReducer = createSlice({
  name: "post",
  initialState: {
    feedPosts: [],
    loading: false,
    suggetionFriends: [],
    error: {},
    postById: {},
    comments: [],
    loandingComments: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedPosts.fulfilled, (state, action) => {
        const { data, current_page, last_page } = action.payload;
        if (current_page === 1) {
          state.feedPosts = action.payload;
        } else {
          state.feedPosts.data = [...state.feedPosts.data, ...data];
          state.feedPosts.current_page = current_page;
          state.feedPosts.last_page = last_page;
        }
      })
      .addCase(feedPosts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(feedPosts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(suggetionFriends.fulfilled, (state, action) => {
        state.suggetionFriends = action.payload;
      })
      .addCase(likeFeedPost.fulfilled, (state, action) => {
        const postLiked = state?.feedPosts?.data?.find(
          (p) => p.post_id === action.meta.arg,
        );
        if (postLiked) {
          postLiked.user_has_liked = 1;
          postLiked.likes_count++;
        }
      })
      .addCase(deslikeFeedPost.fulfilled, (state, action) => {
        const postLiked = state?.feedPosts?.data?.find(
          (p) => p.post_id === action.meta.arg,
        );
        if (postLiked) {
          postLiked.user_has_liked = 0;
          postLiked.likes_count--;
        }
      })
      .addCase(followSuggetion.fulfilled, (state, action) => {
        const userSuggestion = state.suggetionFriends.find(
          (s) => s.user_id === action.meta.arg,
        );
        if(userSuggestion){
          userSuggestion.has_followed = 1;
        }
      })
      .addCase(unfollowSuggestion.fulfilled, (state, action) => {
        const userSuggestion = state.suggetionFriends.find(
          (s) => s.user_id === action.meta.arg,
        );
        if(userSuggestion){
          userSuggestion.has_followed = 0;
        }
      })
      .addCase(createPost.fulfilled, (state, action) => {
        gooeyToast.success("Post created successfuly");
        state.error = {};
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(postById.fulfilled, (state, action) => {
        state.postById = action.payload;
      })
      .addCase(postById.rejected, (state, action) => {
        notFound();
      })
      .addCase(comments.pending, (state) => {
        state.loadingComments = true;
      })
      .addCase(comments.fulfilled, (state, action) => {
        state.loadingComments = false;
        const { data, current_page, last_page, total } = action.payload;

        if (current_page === 1) {
          state.comments = action.payload;
        } else {
          state.comments.data = [...state.comments.data, ...data];
          state.comments.current_page = current_page;
          state.comments.last_page = last_page;
          state.comments.total = total;
        }
      })
      .addCase(comments.rejected, (state) => {
        state.loadingComments = false;
      })

      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.data.push(action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const postLiked = state.postById;
        postLiked.user_has_liked = true;
        postLiked.likes_count++;
      })
      .addCase(deslikePost.fulfilled, (state, action) => {
        const postLiked = state.postById;
        postLiked.user_has_liked = false;
        postLiked.likes_count--;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.feedPosts.data = state.feedPosts.data.filter((p) => {
          return p.post_id !== action.meta.arg;
        });
        gooeyToast.success("post deleted successfuly");
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const comment = state.comments.data.find(
          (c) => c.comment_id === action.meta.arg,
        );
        comment.user_has_liked = 1;
      })
      .addCase(deslikeComment.fulfilled, (state, action) => {
        const comment = state.comments.data.find(
          (c) => c.comment_id === action.meta.arg,
        );
        comment.user_has_liked = 0;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const comments = state.comments.data.filter(
          (c) => c.comment_id !== action.meta.arg,
        );
        state.comments.data = comments;
      });
  },
});
export default PostReducer.reducer;
