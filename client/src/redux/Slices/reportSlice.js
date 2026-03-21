import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { gooeyToast } from "goey-toast";

export const reportPost = createAsyncThunk(
  "report/posts",
  async ({ postId, reason }, thunkAPI) => {
    try {
      const response = await api.post(`/report/post/${postId}`, {
        reason,
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const reportComment = createAsyncThunk(
  "report/comment",
  async ({ commentId, reason }, thunkAPI) => {
    try {
      const response = await api.post(`/report/comment/${commentId}`, {
        reason,
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const myReport = createAsyncThunk(
  "report/myReport",
  async (page = 1, thunkAPI) => {
    try {
      const response = await api.get(`/report?page=${page}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const reportUser = createAsyncThunk(
  "report/user",
  async ({ userId, reason }, thunkAPI) => {
    try {
      const response = await api.post(`/report/user/${userId}`, {
        reason,
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

const reportReducer = createSlice({
  name: "report",
  initialState: {
    reports: [],
    loadingReports:false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(reportUser.fulfilled, () => {
        gooeyToast.success(
          "thank you for your report will be handel it soon posible ",
        );
      })
      .addCase(reportComment.fulfilled, () => {
        gooeyToast.success(
          "thank you for your report will be handel it soon posible ",
        );
      })
      .addCase(reportPost.fulfilled, () => {
        gooeyToast.success(
          "thank you for your report will be handel it soon posible ",
        );
      })
      .addCase(myReport.pending, (state) => {
        state.loadingReports = true;
      })
      .addCase(myReport.fulfilled, (state, action) => {
        state.loadingReports = false;
        const { data, current_page, last_page } = action.payload;

        if (current_page === 1 || !state.reports) {
          state.reports = action.payload;
        } else {
          state.reports.data = [...state.reports.data, ...data];
          state.reports.current_page = current_page;
          state.reports.last_page = last_page;
        }
      })
      .addCase(myReport.rejected, (state) => {
        state.loadingReports = false;
      });
  },
});
export default reportReducer.reducer;
