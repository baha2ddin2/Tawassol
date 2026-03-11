import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { gooeyToast } from "goey-toast";

export const profileInfo = createAsyncThunk(
  "profile/profileInfo",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/profile");
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);
export const ProfileById = createAsyncThunk(
  "profile/profileById",
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);
export const postsByProfileId = createAsyncThunk(
  "profile/postsByProfileId",
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/profile-posts/${userId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);
export const following = createAsyncThunk(
  "profile/following",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/following");
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const followers = createAsyncThunk(
  "profile/followers",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/followers");
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const profilePosts = createAsyncThunk(
  "profile/profilePosts",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/profile-posts");
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);
export const likeProfilePost = createAsyncThunk(
  "Profile/likePost",
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

export const updateAvatar = createAsyncThunk(
  "Profile/updateAvatar",
  async (data, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("avatar", data);
      const response = await api.post(`/avatar`, formData, {
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

export const updateProfile = createAsyncThunk(
  "Profile/updateProfile",
  async (data, thunkAPI) => {
    try {
      const response = await api.put(`/profile`, data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const deslikeProfilePost = createAsyncThunk(
  "Profile/deslikePost",
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

const ProfileReducer = createSlice({
  name: "Profile",
  initialState: {
    profileInfo: {},
    profileId:{},
    profilePosts: [],
    following: [],
    followers: [],
  },
  reducers: {
    deletePostProfile: (state, action) => {
      state.profilePosts.data = state.feedPosts.data.filter((p) => {
        return p.post_id !== action.payload;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profileInfo.fulfilled, (state, action) => {
        const data = action.payload;
        console.log(data);
        state.profileInfo = data;
      })
      .addCase(profilePosts.fulfilled, (state, action) => {
        const data = action.payload;
        console.log(data);
        state.profilePosts = data;
      })
      .addCase(postsByProfileId.fulfilled, (state, action) => {
        const data = action.payload;
        console.log(data);
        state.profilePosts = data;
      })
      .addCase(likeProfilePost.fulfilled, (state, action) => {
        const postLiked = state.profilePosts.data.find(
          (p) => p.post_id === action.meta.arg,
        );
        postLiked.user_has_liked = 1;
        postLiked.likes_count++;
      })
      .addCase(deslikeProfilePost.fulfilled, (state, action) => {
        const postLiked = state.profilePosts.data.find(
          (p) => p.post_id === action.meta.arg,
        );
        postLiked.user_has_liked = 0;
        postLiked.likes_count--;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        gooeyToast.success("your profile is updated");
      })
      .addCase(following.fulfilled, (state, action) => {
        state.following = action.payload;
      })
      .addCase(followers.fulfilled, (state, action) => {
        state.followers = action.payload;
      })
      .addCase(ProfileById.fulfilled,(state,action)=>{
        state.profileId = action.payload
      })
  },
});
export const { deletePostProfile } = ProfileReducer.actions;
export default ProfileReducer.reducer;
