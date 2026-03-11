import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const weekTendence = createAsyncThunk('search/weekTendence',
    async (_,thunkAPI)=>{
        try{
            const response = await api.get('/week-tendence')
            return response.data
        }catch(error){
            const errorMsg = error.response.data;
            return thunkAPI.rejectWithValue(errorMsg)
        }
    }
)
export const search  = createAsyncThunk('search/search',
    async (query,thunkAPI)=>{
        try{
            const response = await api.get('/search?s='+query)
            return response.data
        }catch(error){
            const errorMsg = error.response.data;
            return thunkAPI.rejectWithValue(errorMsg)
        }
    }
)

export const searchResult  = createAsyncThunk('search/results',
    async (query,thunkAPI)=>{
        try{
            const response = await api.get('/search-results?s='+query)
            return response.data
        }catch(error){
            const errorMsg = error.response.data;
            return thunkAPI.rejectWithValue(errorMsg)
        }
    }
)


const searchReducer = createSlice({
        name:"search",
        initialState:{
            weekTendece:[],
            searchInputResults :[],
            searchResults :[] 
        },
        reducers:{
            clearSearch : (state)=>{
                state.searchInputResults =[]
            }
        },extraReducers:(builder)=>{
            builder
            .addCase(weekTendence.fulfilled,(state,action)=>{
                const data = action.payload
                state.weekTendece = data
                console.log(action.payload)
                
            })
            .addCase(search.fulfilled,(state,action)=>{
                console.log(action.payload)
                state.searchInputResults = action.payload.map((u)=>u.display_name)
            })
            .addCase(searchResult.fulfilled,(state,action)=>{
                console.log(action.payload)
                state.searchResults = action.payload
                
            })
        }
        
    }
)
export const {clearSearch} = searchReducer.actions
export default searchReducer.reducer