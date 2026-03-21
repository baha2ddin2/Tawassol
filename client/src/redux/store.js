import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "@/redux/Slices/AuthSlice";
import PostReducer from "./Slices/postSlice";
import SearchReducer from "./Slices/searchSlice";
import notificationReducer from "./Slices/notificationSlice";
import profileReducer from "./Slices/profileSlice";
import hashtagReducer from "./Slices/hashtagSlice";
import messageReducer from "./Slices/messageSlice";
import reportReducer from "./Slices/reportSlice";
import dashboardSlice from "./Slices/dashboardSlice"

export default configureStore({
  reducer: {
    auth: AuthReducer,
    post: PostReducer,
    search: SearchReducer,
    notification: notificationReducer,
    profile: profileReducer,
    hashtag: hashtagReducer,
    message: messageReducer,
    report: reportReducer,
    dashboard : dashboardSlice
  },
});
