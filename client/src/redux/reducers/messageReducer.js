import api, { messagesApi } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { gooeyToast } from "goey-toast";



export const messages = createAsyncThunk(
  "message/conversation",
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/conversation/${userId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const GroupMessages = createAsyncThunk(
  "message/GroupConversation",
  async (groupId, thunkAPI) => {
    try {
      const response = await api.get(`/group/conersation/${groupId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const contact = createAsyncThunk(
  "message/contact",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/contacts`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const availableMembers = createAsyncThunk(
  "message/availableMembers",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/group/available-members`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const getGroupDetails = createAsyncThunk(
  "message/getGroupDetails",
  async (groupId, thunkAPI) => {
    try {
      const response = await api.get(`/group/${groupId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({reciveMessage , formData}, thunkAPI) => {
    try {
      const response = await messagesApi.post(`/messages/send/${reciveMessage}`,formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const sendGroupMessage = createAsyncThunk(
  "message/sendGroupMessage",
  async ({groupId , formData}, thunkAPI) => {
    try {
      const response = await messagesApi.post(`/group-messages/send/${groupId}`,formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const createGroup = createAsyncThunk(
  "message/createGroup",
  async (formData, thunkAPI) => {
    try {
      const response = await api.post(`/group`,formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);



const messageReducer = createSlice({
  name: "message",
  initialState: {
    messages:[],
    contacts:[],
    GroupMessages:[],
    availableMembersOptions:[],
    groupInfo:{},
    loading : true

  },
  reducers: {
    reciveMessage:(state,action)=>{
      state.messages.push(action.payload)
    },
    reciveGroupMessage:(state,action)=>{
      state.GroupMessages.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(messages.fulfilled, (state, action) => {
        const data = action.payload;
        state.messages = data;
      })
      .addCase(messages.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(messages.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(contact.fulfilled,(state,action)=>{
        state.contacts = action.payload
      })
      .addCase(GroupMessages.fulfilled,(state,action)=>{
        state.GroupMessages = action.payload
      })
      .addCase(sendMessage.rejected,(state,action)=>{
        console.log(action.payload)
      })
      .addCase(sendGroupMessage.fulfilled,(state,action)=>{
        console.log(action.payload)
      })
      .addCase(createGroup.fulfilled,(state,action)=>{
        gooeyToast.success("the group created successfuly",{
          description:"refresh the page if you can't find the group" 
        })
      })
      .addCase(availableMembers.fulfilled,(state,action)=>{
        state.availableMembersOptions = action.payload
      })
      .addCase(getGroupDetails.pending,(state,action)=>{
        state.loading = true
      })
      .addCase(getGroupDetails.rejected,(state,action)=>{
        state.loading = false
      })
      .addCase(getGroupDetails.fulfilled,(state,action)=>{
        state.groupInfo = action.payload
        state.loading = false
      })
  },
});
export const {reciveMessage,reciveGroupMessage}= messageReducer.actions
export default messageReducer.reducer;
