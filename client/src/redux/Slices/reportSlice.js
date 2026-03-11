import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { gooeyToast } from "goey-toast";



export const reportPost = createAsyncThunk(
  "report/posts",
  async ({id,reason}, thunkAPI) => {
    try {
      const response = await api.post(`/report/post/${id}`,{
        reason
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
  async ({id,reason}, thunkAPI) => {
    try {
      const response = await api.post(`/report/comment/${id}`,{
        reason
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
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/report`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const reportUser = createAsyncThunk(
  "report/user",
  async ({id,reason}, thunkAPI) => {
    try {
      const response = await api.post(`/report/user/${id}`,{
        reason
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
    reports:[]
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(reportUser.fulfilled, () => {
        gooeyToast.success("thank you for your report will be handel it soon posible ")
      })
      .addCase(reportComment.fulfilled, () => {
        gooeyToast.success("thank you for your report will be handel it soon posible ")
      })
      .addCase(reportPost.fulfilled,()=>{
        gooeyToast.success("thank you for your report will be handel it soon posible ")
      })
      .addCase(myReport.fulfilled,(state,action)=>{
          state.reports=action.payload
      })


  },
});
export default reportReducer.reducer;
