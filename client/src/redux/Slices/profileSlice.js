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
  async ({ userId, page = 1 }, thunkAPI) => {
    try {
      const response = await api.get(`/profile-posts/${userId}?page=${page}`);
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

export const followingByUser = createAsyncThunk(
  "profile/followingByUser",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/following/${userId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const followersByUser = createAsyncThunk(
  "profile/followersByUser",
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/followers/${userId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const profilePosts = createAsyncThunk(
  "profile/profilePosts",
  async (page = 1, thunkAPI) => {
    try {
      const response = await api.get(`/profile-posts?page=${page}`);
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

export const followUser = createAsyncThunk(
  "profile/follow",
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

export const unfollowUser = createAsyncThunk(
  "profile/unfollow",
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

const ProfileReducer = createSlice({
  name: "Profile",
  initialState: {
    loadingProfilePosts: false,
    profileInfo: {},
    profileId: {},
    profilePosts: [],
    following: [],
    followers: [],
    followingByUser: [],
    followersByUser: [],
  },
  reducers: {
    deletePostProfile: (state, action) => {
      state.profilePosts.data = state.profilePosts.data.filter((p) => {
        return p.post_id !== action.payload;
      });
    },
    followFollowingUser: (state, action) => {
      const user = state.following.find((s) => s.user_id === action.payload);
      user.has_followed = 1;
    },
    unfollowFollowingUser: (state, action) => {
      const user = state.following.find((s) => s.user_id === action.payload);
      user.has_followed = 0;
    },
    followFollowersUser: (state, action) => {
      const user = state.followers.find((s) => s.user_id === action.payload);
      user.has_followed = 1;
    },
    unfollowFollowersUser: (state, action) => {
      const user = state.followers.find((s) => s.user_id === action.payload);
      user.has_followed = 0;
    },
    followFollowingByUser: (state, action) => {
      const user = state.followingByUser.find(
        (s) => s.user_id === action.payload,
      );
      user.has_followed = 1;
    },
    unfollowFollowingByUser: (state, action) => {
      const user = state.followingByUser.find(
        (s) => s.user_id === action.payload,
      );
      user.has_followed = 0;
    },
    followFollowersByUser: (state, action) => {
      const user = state.followersByUser.find(
        (s) => s.user_id === action.payload,
      );
      user.has_followed = 1;
    },
    unfollowFollowersByUser: (state, action) => {
      const user = state.followersByUser.find(
        (s) => s.user_id === action.payload,
      );
      user.has_followed = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profileInfo.fulfilled, (state, action) => {
        const data = action.payload;
        state.profileInfo = data;
      })
      .addCase(profilePosts.pending, (state) => {
        state.loadingProfilePosts = true;
      })
      .addCase(profilePosts.fulfilled, (state, action) => {
        state.loadingProfilePosts = false;
        const { data, current_page, last_page } = action.payload;

        if (current_page === 1 || !state.profilePosts) {
          state.profilePosts = action.payload;
        } else {
          state.profilePosts.data = [...state.profilePosts.data, ...data];
          state.profilePosts.current_page = current_page;
          state.profilePosts.last_page = last_page;
        }
      })
      .addCase(profilePosts.rejected, (state) => {
        state.loadingProfilePosts = false;
      })
      .addCase(postsByProfileId.pending, (state) => {
        state.loadingProfilePosts = true;
      })
      .addCase(postsByProfileId.fulfilled, (state, action) => {
        state.loadingProfilePosts = false;
        const { data, current_page, last_page } = action.payload;

        if (current_page === 1 || !state.profilePosts) {
          state.profilePosts = action.payload;
        } else {
          state.profilePosts.data = [...state.profilePosts.data, ...data];
          state.profilePosts.current_page = current_page;
          state.profilePosts.last_page = last_page;
        }
      })
      .addCase(postsByProfileId.rejected, (state) => {
        state.loadingProfilePosts = false;
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
      .addCase(ProfileById.fulfilled, (state, action) => {
        state.profileId = action.payload;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.profileId.is_following = 1;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.profileId.is_following = 0;
      })
      .addCase(followersByUser.fulfilled, (state, action) => {
        state.followersByUser = action.payload;
      })
      .addCase(followingByUser.fulfilled, (state, action) => {
        state.followingByUser = action.payload;
      });
  },
});
export const {
  deletePostProfile,
  followFollowersByUser,
  followFollowingByUser,
  followFollowersUser,
  followFollowingUser,
  unfollowFollowersByUser,
  unfollowFollowersUser,
  unfollowFollowingByUser,
  unfollowFollowingUser,
} = ProfileReducer.actions;
export default ProfileReducer.reducer;
