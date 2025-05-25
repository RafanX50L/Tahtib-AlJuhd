// store/slices/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/implementation/api";
import { UserInterface } from "@/types/user";

console.log("Auth slice importing API instance:", (api as any).__instanceId);

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
  "auth/refresh-Token",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      console.log("Sending refresh token request...");
      const response = await api.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      console.log("Refresh token response:", response.data);
      if (!response.data.accessToken) {
        throw new Error("No access token in response");
      }
      return response.data;
    } catch (error) {
      console.error("Refresh token error:", error);
      dispatch(logout());
      return rejectWithValue("Session expired, please login again.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserInterface; accessToken: string }>
    ) => {
      console.log("Setting credentials:", action.payload);
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      state.isAuthenticated = true;
      localStorage.setItem("sessionActive", "true");
    },
    logout: (state) => {
      console.log("Logging out...");
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      state.user = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserInterface>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setUserPersonalization: (state, action: PayloadAction<{ _id: string}>) => {
      if (state.user) {
        (state.user as any).personalization = action.payload._id;
        // ['userBasicInfo', 'fitnessGoal', 'fitnessLevel', 'activityLevel', 'workoutPreferences', 'healthInfo', 'dietPreferences'].forEach(key => localStorage.removeItem(key));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        console.log("Refresh token fulfilled:", action.payload);
        authSlice.caseReducers.setCredentials(state, action);
        state.status = "succeeded";
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        console.log("Refresh token rejected");
        state.isAuthenticated = false;
        state.user = null;
        state.status = "failed";
      });
  },
});

export const { setCredentials, logout, updateUserProfile, setUserPersonalization } = authSlice.actions;
export default authSlice.reducer;