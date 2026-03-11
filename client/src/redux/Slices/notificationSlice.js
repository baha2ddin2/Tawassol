import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const notificationCountUnread = createAsyncThunk('Notification/count',
    async (_,thunkAPI)=>{
        try{
            const response = await api.get('/unread-count')
            return response.data
        }catch(error){
            const errorMsg = error.response.data;
            return thunkAPI.rejectWithValue(errorMsg)
        }
    }
)


export const notification = createAsyncThunk('Notification/notification',
    async (_,thunkAPI)=>{
        try{
            const response = await api.get('/notifications')
            return response.data
        }catch(error){
            const errorMsg = error.response.data;
            return thunkAPI.rejectWithValue(errorMsg)
        }
    }
)


const NotificationReducer = createSlice({
        name:"notification",
        initialState:{
            unReadCount:0,
            notificationData : []
        },
        reducers:{

        },extraReducers:(builder)=>{
            builder
            .addCase(notificationCountUnread.fulfilled,(state,action)=>{
                const data = action.payload.unread_count
                state.unReadCount = data
                
            })
            .addCase(notification.fulfilled,(state,action)=>{
                state.notificationData = action.payload

            })   
        }
        
    }
)
export default NotificationReducer.reducer