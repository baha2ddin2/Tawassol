import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const login = createAsyncThunk('Auth/login',
    async ({email,password},thunkAPI)=>{
        try{
            const response = await api.post('/login',{
                email,
                password
            })
            return response.data
        }catch(error){
            const errorMsg = error.response.data;
            return thunkAPI.rejectWithValue(errorMsg)
        }
    }
)


export const register = createAsyncThunk('Auth/register',
    async (formData, thunkAPI) => { // Accept formData directly, no destructuring
        try {
            const response = await api.post('/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const logout = createAsyncThunk('Auth/logout',
    async(_,thunkAPI)=>{
        try{
            const response = await api.post('/logout')
            return response.data
        }catch(error){
            const errorMsg = error.response.data;
            return thunkAPI.rejectWithValue(errorMsg)
        }
    }
)

export const checkAuth = createAsyncThunk('Auth/checkAuth',
    async(_,thunkAPI)=>{
        try{
            const response = await api.post('/check-auth')
            return response.data
        }catch(error){
            const errorMsg = error.response.data;
            return thunkAPI.rejectWithValue(errorMsg)
        }
    }
)



const AuthReducer = createSlice({
        name:"auth",
        initialState:{
            userInfo:{},
            loading :false,
            checkAuthLoading :true,
            error:"",
            registerErrors:{},
            isAuth:false

        },
        reducers:{
            deleteErrorState:(state)=>{
                state.error =''
            }
        },extraReducers:(builder)=>{
            builder
            .addCase(login.fulfilled,(state,action)=>{
                const data= action.payload
                state.userInfo = data
                state.isAuth = true
                console.log(data)
                
            })
            .addCase(login.pending,(state,action)=>{
                state.loading = true
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload;
                state.loading =false
                console.log(action.payload)
            })
            .addCase(register.fulfilled,(state,action)=>{
                const data= action.payload
                state.userInfo = data
                state.isAuth = true
            })
            .addCase(register.pending,(state,action)=>{
                state.loading = true
            })
            .addCase(register.rejected, (state, action) => {
                state.registerErrors = action.payload;
                state.loading =false
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.userInfo = {}
                state.isAuth = false
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(checkAuth.fulfilled,(state,action)=>{
                const data= action.payload
                state.userInfo = data
                state.isAuth = true
                state.checkAuthLoading = false
            })
            .addCase(checkAuth.pending,(state,action)=>{
                state.checkAuthLoading = true
            })
            .addCase(checkAuth.rejected,(state,action)=>{
                state.checkAuthLoading =false
            })
            
        }
        
    }
)
export const {deleteErrorState}=AuthReducer.actions
export default AuthReducer.reducer