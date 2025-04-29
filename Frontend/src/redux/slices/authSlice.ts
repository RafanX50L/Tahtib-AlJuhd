import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        registerUser: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        registerUserSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        registerUserFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const { registerUser, registerUserSuccess, registerUserFailure } = authSlice.actions;
export default authSlice.reducer;