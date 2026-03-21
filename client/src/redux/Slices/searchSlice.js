import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const weekTendence = createAsyncThunk(
  "search/weekTendence",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/week-tendence");
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const searchPosts = createAsyncThunk(
  "search/searchPosts",
  async ({ query, page = 1 }, thunkAPI) => {
    try {
      const response = await api.get(
        `/search-results/post?s=${query}&page=${page}`,
      );
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data || "An error occurred";
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);
export const search = createAsyncThunk(
  "search/search",
  async (query, thunkAPI) => {
    try {
      const response = await api.get("/search?s=" + query);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const searchResult = createAsyncThunk(
  "search/results",
  async (query, thunkAPI) => {
    try {
      const response = await api.get("/search-results?s=" + query);
      return response.data;
    } catch (error) {
      const errorMsg = error.response.data;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const searchProfiles = createAsyncThunk(
  "search/searchProfiles",
  async ({ query, page = 1 }, thunkAPI) => {
    try {
      const response = await api.get(
        `/search-results/profile?s=${query}&page=${page}`,
      );
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data || "An error occurred";
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

const searchReducer = createSlice({
  name: "search",
  initialState: {
    weekTendece: [],
    searchInputResults: [],
    searchResults: [],
  },
  reducers: {
    clearSearch: (state) => {
      state.searchInputResults = [];
    },
    likeSearchPost: (state, action) => {
      const post = state.searchResults.data.find(
        (p) => p.post_id === action.payload,
      );
      post.user_has_liked = 1;
      post.likes_count++;
    },
    deslikeSearchPost: (state, action) => {
      const post = state.searchResults.data.find(
        (p) => p.post_id === action.payload,
      );
      post.user_has_liked = 0;
      post.likes_count--;
    },
    likeSearchResultsPost: (state, action) => {
      const post = state.searchResults.posts.find(
        (p) => p.post_id === action.payload,
      );
      post.user_has_liked = 1;
      post.likes_count++;
    },
    deslikeResultsSearchPost: (state, action) => {
      const post = state.searchResults.posts.find(
        (p) => p.post_id === action.payload,
      );
      post.user_has_liked = 0;
      post.likes_count--;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(weekTendence.fulfilled, (state, action) => {
        const data = action.payload;
        state.weekTendece = data;
        console.log(action.payload);
      })
      .addCase(search.fulfilled, (state, action) => {
        console.log(action.payload);
        state.searchInputResults = action.payload.map((u) => u.display_name);
      })
      .addCase(searchResult.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(searchPosts.pending, (state) => {
        state.loadingSearch = true;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loadingSearch = false;
        if (Array.isArray(action.payload) && action.payload.length === 0) {
          state.searchResults = { data: [], current_page: 1, last_page: 1 };
          return;
        }

        const { data, current_page, last_page } = action.payload;

        if (current_page === 1 || !state.searchResults?.data) {
          state.searchResults = action.payload;
        } else {
          state.searchResults.data = [...state.searchResults.data, ...data];
          state.searchResults.current_page = current_page;
          state.searchResults.last_page = last_page;
        }
      })
      .addCase(searchPosts.rejected, (state) => {
        state.loadingSearch = false;
      })
      .addCase(searchProfiles.pending, (state) => {
        state.loadingProfileSearch = true;
      })
      .addCase(searchProfiles.fulfilled, (state, action) => {
        state.loadingProfileSearch = false;

        if (Array.isArray(action.payload) && action.payload.length === 0) {
          state.searchProfileResults = {
            data: [],
            current_page: 1,
            last_page: 1,
          };
          return;
        }

        const { data, current_page, last_page } = action.payload;

        if (current_page === 1 || !state.searchProfileResults?.data) {
          // Initial load or new search term: replace data
          state.searchProfileResults = action.payload;
        } else {
          // Scroll load: append new data
          state.searchProfileResults.data = [
            ...state.searchProfileResults.data,
            ...data,
          ];
          state.searchProfileResults.current_page = current_page;
          state.searchProfileResults.last_page = last_page;
        }
      })
      .addCase(searchProfiles.rejected, (state) => {
        state.loadingProfileSearch = false;
      });
  },
});
export const {
  clearSearch,
  likeSearchPost,
  deslikeSearchPost,
  likeSearchResultsPost,
  deslikeResultsSearchPost,
} = searchReducer.actions;
export default searchReducer.reducer;
