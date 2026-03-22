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

export const updateGroup = createAsyncThunk(
  "message/updateGroup",
  async ({ groupId, data }, thunkAPI) => {
    try {
      const response = await api.post(`/group/${groupId}`, data, {
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

export const deleteGroup = createAsyncThunk(
  "message/deleteGroup",
  async (groupId, thunkAPI) => {
    try {
      const response = await api.delete(`/group/${groupId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({ reciveMessage, formData }, thunkAPI) => {
    try {
      const response = await messagesApi.post(
        `/messages/send/${reciveMessage}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const deleteMessage = createAsyncThunk(
  "message/deleteMessage",
  async (messageId, thunkAPI) => {
    try {
      const response = await messagesApi.delete(
        `/messages/delete/${messageId}`,
      );
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const deleteGroupMessage = createAsyncThunk(
  "message/deleteGroupMessage",
  async (messageId, thunkAPI) => {
    try {
      const response = await messagesApi.delete(
        `/group-messages/delete/${messageId}`,
      );
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const sendGroupMessage = createAsyncThunk(
  "message/sendGroupMessage",
  async ({ groupId, formData }, thunkAPI) => {
    try {
      const response = await messagesApi.post(
        `/group-messages/send/${groupId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const updateGroupMessage = createAsyncThunk(
  "message/updateGroupMessage",
  async ({ messageId, newContent }, thunkAPI) => {
    try {
      const response = await messagesApi.put(`/group-messages/update/${messageId}`, {
        content: newContent,
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);


export const updateMessage = createAsyncThunk(
  "message/updateMessage",
  async ({ messageId, newContent }, thunkAPI) => {
    try {
      const response = await messagesApi.put(`/messages/update/${messageId}`, {
        content: newContent,
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const seenMessage = createAsyncThunk(
  "message/seenMessage",
  async (messageId, thunkAPI) => {
    try {
      const response = await messagesApi.put(`/messages/seen/${messageId}`);
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
      const response = await api.post(`/group`, formData, {
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

export const getContact = createAsyncThunk(
  "message/getcontact",
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/contact/${userId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const addMembersToGroup = createAsyncThunk(
  "message/addMembersToGroup",
  async ({ groupId, userIds }, thunkAPI) => {
    try {
      const response = await api.post(`/group/add-membes/${groupId}`, {
        members: userIds,
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const removeMemberFromGroup = createAsyncThunk(
  "message/removeMemberFromGroup",
  async ({ groupId, userId }, thunkAPI) => {
    try {
      const response = await api.delete(`/group/${groupId}/member/${userId}`);
      return { groupId, userId, message: response.data.message };
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const makeMemberAdmin = createAsyncThunk(
  "message/makeMemberAdmin",
  async ({ groupId, userId }, thunkAPI) => {
    try {
      const response = await api.put(`/group/${groupId}/make-admin/${userId}`);
      return { groupId, userId, message: response.data.message };
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

const messageReducer = createSlice({
  name: "message",
  initialState: {
    messages: [],
    contacts: [],
    contact: {},
    GroupMessages: [],
    availableMembersOptions: [],
    groupInfo: {},
    loading: true,
  },
  reducers: {
    reciveMessage: (state, action) => {
      state.messages.push(action.payload);
      const contact = state.contacts.find((c)=>c.user_id===action.payload.recipient_id) || state.contacts.find((c)=>c.user_id===action.payload.sender_id)
      contact.last_message = action.payload.content
      contact.last_message_time = action.payload.created_at
    },
    reciveGroupMessage: (state, action) => {
      state.GroupMessages.push(action.payload);
      const contact = state.contacts.find((c)=>c.group_id===action.payload.group_id)
      contact.last_message = action.payload.content
      contact.last_message_time = action.payload.created_at
    },
    deletedMessage: (state, action) => {
      state.messages = state.messages.filter(
        (m) => m.message_id !== action.payload.messageId,
      );
    },
    updatedMessage: (state, action) => {
      const messageUpdate = state.messages.find(
        (m) => m.message_id === action.payload.messageId,
      );
      messageUpdate.content = action.payload.content;
    },
    deletedGroupMessage: (state, action) => {
      state.GroupMessages = state.GroupMessages.filter(
        (m) => m.message_id !== action.payload.messageId,
      );
    },
    updatedGroupMessage: (state, action) => {
      const messageUpdate = state.GroupMessages.find(
        (m) => m.message_id === action.payload.messageId,
      );
      messageUpdate.content = action.payload.content;
    },
    seenMessageAction: (state, action) => {
      const messageUpdate = state.messages.find(
        (m) => m.message_id === action.payload.messageId,
      );
      messageUpdate.is_read = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(messages.fulfilled, (state, action) => {
        state.messages = action.payload || [];
        state.loading = false;
      })
      .addCase(messages.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(messages.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(contact.pending, (state) => {
        state.loading = true;
      })
      .addCase(contact.fulfilled, (state, action) => {
        state.contacts = action.payload || [];
        state.loading = false;
      })
      .addCase(contact.rejected, (state, action) => {
        state.contacts = [];
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GroupMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(GroupMessages.fulfilled, (state, action) => {
        state.GroupMessages = action.payload || [];
        state.loading = false;
      })
      .addCase(GroupMessages.rejected, (state, action) => {
        state.GroupMessages = [];
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        gooeyToast.success("the group created successfuly");
      })
      .addCase(availableMembers.fulfilled, (state, action) => {
        state.availableMembersOptions = action.payload;
      })
      .addCase(getGroupDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getGroupDetails.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getGroupDetails.fulfilled, (state, action) => {
        state.groupInfo = action.payload;
        state.loading = false;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(
          (m) => m.message_id !== action.payload.messageId,
        );
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        const messageUpdate = state.messages.find(
          (m) => m.message_id === action.payload.message_id,
        );
        messageUpdate.content = action.payload.content;
      })
      .addCase(getContact.fulfilled, (state, action) => {
        state.contact = action.payload;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.groupInfo = action.payload.data;
      })
      .addCase(deleteGroup.fulfilled,(state,action)=>{
        gooeyToast.success("the group deleted successfuly")
        state.contacts = state.contacts.filter((c)=>c.group_id!==action.meta.arg)
      })
      .addCase(deleteGroup.rejected,(state,action)=>{
        gooeyToast.error(action.payload.message)
      })
      .addCase(removeMemberFromGroup.fulfilled, (state, action) => {
        gooeyToast.success("Member removed successfully");
        if (state.groupInfo && state.groupInfo.group_id === action.payload.groupId) {
          state.groupInfo.members = state.groupInfo.members.filter(
            (m) => m.user_id !== action.payload.userId
          );
        }
      })
      .addCase(removeMemberFromGroup.rejected, (state, action) => {
        gooeyToast.error(action.payload?.message || "Error removing member");
      })
      .addCase(makeMemberAdmin.fulfilled, (state, action) => {
        gooeyToast.success("Member promoted to admin");
        if (state.groupInfo && state.groupInfo.group_id === action.payload.groupId) {
          const member = state.groupInfo.members.find(
            (m) => m.user_id === action.payload.userId
          );
          if (member) {
            member.role = "admin";
          }
        }
      })
      .addCase(makeMemberAdmin.rejected, (state, action) => {
        gooeyToast.error(action.payload?.message || "Error promoting member");
      })
  },
});
export const {
  updatedMessage,
  reciveMessage,
  reciveGroupMessage,
  deletedMessage,
  seenMessageAction,
  updatedGroupMessage,
  deletedGroupMessage
  
} = messageReducer.actions;
export default messageReducer.reducer;
