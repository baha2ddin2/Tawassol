import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { gooeyToast } from "goey-toast";



export const hashtagPosts = createAsyncThunk(
  "hashtag/posts",
  async (tag, thunkAPI) => {
    try {
      const response = await api.get(`/hashtag/${tag}`);
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
    hashtagPosts:[],
    hashtagCount:{}
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(hashtagPosts.fulfilled, (state, action) => {
        const data = action.payload;
        state.hashtagPosts = data;
      })
      .addCase(hashtagCount.fulfilled, (state, action) => {
        const data = action.payload;
        state.hashtagCount = data;
      })
  },
});
export default hashtagReducer.reducer;
