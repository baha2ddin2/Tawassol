import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const notificationCountUnread = createAsyncThunk(
  "Notification/count",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/unread-count");
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const notification = createAsyncThunk(
  "Notification/notification",
  async (page = 1, thunkAPI) => {
    try {
      const response = await api.get(`/notifications?page=${page}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const markAllRead = createAsyncThunk(
  "Notification/markAllRead",
  async (_, thunkAPI) => {
    try {
      const response = await api.put("/mark-all-read");
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);
export const markRead = createAsyncThunk(
  "Notification/markARead",
  async (notificationId, thunkAPI) => {
    try {
      const response = await api.put(`/mark-as-read/${notificationId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

const NotificationReducer = createSlice({
  name: "notification",
  initialState: {
    unReadCount: 0,
    notificationData: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(notificationCountUnread.fulfilled, (state, action) => {
        const data = action.payload.unread_count;
        state.unReadCount = data;
      })
      .addCase(notification.pending, (state) => {
        state.loading = true;
      })
      .addCase(notification.fulfilled, (state, action) => {
        state.loading = false;
        const { data, current_page, last_page } = action.payload;

        if (current_page === 1) {
          state.notificationData = action.payload;
        } else {
          state.notificationData.data = [
            ...state.notificationData.data,
            ...data,
          ];
          state.notificationData.current_page = current_page;
          state.notificationData.last_page = last_page;
        }
      })
      .addCase(notification.rejected, (state) => {
        state.loading = false;
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.notificationData.data = state.notificationData.data.map((n) => ({
          ...n,
          is_read: 1,
        }));
        state.unReadCount = 0;
      });
  },
});
export default NotificationReducer.reducer;
