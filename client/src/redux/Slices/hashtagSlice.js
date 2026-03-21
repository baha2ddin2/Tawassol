import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { gooeyToast } from "goey-toast";

export const hashtagPosts = createAsyncThunk(
  "hashtag/posts",
  async ({ tag, page = 1 }, thunkAPI) => {
    try {
      const response = await api.get(`/hashtag/${tag}?page=${page}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const hashtagCount = createAsyncThunk(
  "hashtag/count",
  async (tag, thunkAPI) => {
    try {
      const response = await api.get(`/count-hashtag/${tag}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

const hashtagReducer = createSlice({
  name: "hashtag",
  initialState: {
    hashtagPosts: [],
    hashtagCount: {},
    loadingHashtagPosts:false,
  },
  reducers: {
    likeHashtagPost: (state, action) => {
      console.log(action);
      const post = state.hashtagPosts.data.find(
        (p) => p.post_id === action.payload,
      );
      post.user_has_liked = 1;
      post.likes_count++;
    },
    deslikeHashtagPost: (state, action) => {
      const post = state.hashtagPosts.data.find(
        (p) => p.post_id === action.payload,
      );
      post.user_has_liked = 0;
      post.likes_count--;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hashtagPosts.pending, (state) => {
        state.loadingHashtagPosts = true;
      })
      .addCase(hashtagPosts.fulfilled, (state, action) => {
        state.loadingHashtagPosts = false;
        const { data, current_page, last_page } = action.payload;

        if (current_page === 1) {
          state.hashtagPosts = action.payload;
        } else {
          state.hashtagPosts.data = [...state.hashtagPosts.data, ...data];
          state.hashtagPosts.current_page = current_page;
          state.hashtagPosts.last_page = last_page;
        }
      })
      .addCase(hashtagPosts.rejected, (state) => {
        state.loadingHashtagPosts = false;
      })
      .addCase(hashtagCount.fulfilled, (state, action) => {
        const data = action.payload;
        state.hashtagCount = data;
      });
  },
});
export const { deslikeHashtagPost, likeHashtagPost } = hashtagReducer.actions;
export default hashtagReducer.reducer;
