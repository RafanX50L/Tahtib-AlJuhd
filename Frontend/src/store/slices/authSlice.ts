import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import api from "@/services/implementation/api";
import { UserInterface } from "@/types/user";

interface AuthState {
  isAuthenticated: boolean;
  user: UserInterface | null;
  accessToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}


const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  status: "idle",
  accessToken: null,
};

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch {
      dispatch(logout());
      return rejectWithValue("Session expired, please login again.");
    }
  }
);

export const VerifyUsers = createAsyncThunk(
  "auth/varifyUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const reponse = await api.get("/auth/autherisation", {
        withCredentials: true,
      });
      console.log(reponse);
      return reponse;
    } catch (error: any) {
      dispatch(logout());
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : error?.response?.data?.message || "Unexpexted Error"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserInterface, accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("sessionActive", "true");
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.user = null;
    },
    updateUserProfile: (
      state,
      action: PayloadAction<Partial<UserInterface>>
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        authSlice.caseReducers.setCredentials(state, action);
        state.status = "succeeded";
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = "failed";
      })
      .addCase(VerifyUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(VerifyUsers.fulfilled, (state, action) => {
        authSlice.caseReducers.setCredentials(state, action);
        state.status = "succeeded";
      })
      .addCase(VerifyUsers.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = "failed";
      })
  },
});


export const { setCredentials, logout, updateUserProfile} = authSlice.actions;
export default authSlice.reducer;