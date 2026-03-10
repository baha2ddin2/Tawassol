import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "@/redux/reducers/AuthReducer";
import PostReducer from "./reducers/postReducer"
import SearchReducer from './reducers/searchReducer'
import notificationReducer from "./reducers/notificationReducer";
import profileReducer from './reducers/profileReducer'
import hashtagReducer from './reducers/hashtagReducer'
import messageReducer from './reducers/messageReducer'
import reportReducer from './reducers/reportReducer'

export default configureStore({
    reducer:{
        auth: AuthReducer,
        post: PostReducer,
        search:SearchReducer,
        notification: notificationReducer,
        profile:profileReducer,
        hashtag:hashtagReducer,
        message:messageReducer,
        report:reportReducer,
    }
})