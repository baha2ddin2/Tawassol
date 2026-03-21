import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const dashboardCount  = createAsyncThunk('dashboard/count',
    async (_,thunkAPI)=>{
        try{
            const response = await api.get('/dashboard/count')
            return response.data
        }catch(error){
            const errorMsg = error.response.data;
            return thunkAPI.rejectWithValue(errorMsg)
        }
    }
)

export const getReports = createAsyncThunk('dashboard/getReports',
    async (params, thunkAPI) => {
        try {
            const page = typeof params === 'object' ? params.page || 1 : params || 1;
            const search = typeof params === 'object' && params.search ? `&search=${encodeURIComponent(params.search)}` : '';
            
            const response = await api.get(`/dashboard/reports?page=${page}${search}`);
            return response.data;
        } catch (error) {
            const errorMsg = error.response?.data || "Something went wrong";
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

export const getReport = createAsyncThunk('dashboard/getReport',
    async (reportId, thunkAPI) => {
        try {
            const response = await api.get(`/dashboard/reports/${reportId}`);
            return response.data;
        } catch (error) {
            const errorMsg = error.response?.data || "Something went wrong";
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

export const handelReport = createAsyncThunk('dashboard/getReport',
    async ({reportId,action}, thunkAPI) => {
        try {
            const response = await api.put(`/dashboard/reports/${reportId}`,{
              action 
            });
            return response.data;
        } catch (error) {
            const errorMsg = error.response?.data || "Something went wrong";
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);



const dashboardSlice = createSlice({
        name:"dashboard",
        initialState:{
            count:{},
            reports:{},
            report:{},
            loading:false
        },
        reducers:{

        },extraReducers:(builder)=>{
            builder
            .addCase(dashboardCount.fulfilled,(state,action)=>{
                const data = action.payload
                state.count = data   

            })
            .addCase(getReports.fulfilled,(state,action)=>{
                state.reports = action.payload
                state.loading=false
            })
            .addCase(getReports.pending,(state,action)=>{
                state.loading=true
            })
            .addCase(getReports.rejected,(state,action)=>{
                state.loading=false
            })
            .addCase(getReport.fulfilled,(state,action)=>{
                state.report=action.payload
                state.loading = false
            })
            .addCase(getReport.rejected,(state,action)=>{
                state.loading = false
            })
            .addCase(getReport.pending,(state,action)=>{
                state.loading = true
            })
        }
        
    }
)
// export const {} = dashboardSlice.actions
export default dashboardSlice.reducer