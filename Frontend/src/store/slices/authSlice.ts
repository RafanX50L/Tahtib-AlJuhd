import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/implementation/api";
import { UserInterface } from "@/types/user";

console.log("Auth slice importing API instance:", (api as any).__instanceId);

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInterface | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  lastLocation: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  status: "idle",
  lastLocation: null,
};

export const refreshAccessToken = createAsyncThunk(
  "auth/refresh-Token",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      console.log("Sending refresh token request...");
      const { tokenVersion } = JSON.parse(localStorage.getItem("accessTokenData") || "{}");
      const response = await api.post(
        "/auth/refresh-token",
        { tokenVersion },
        { withCredentials: true }
      );
      console.log("Refresh token response:", response.data);
      if (!response.data.accessToken) {
        throw new Error("No access token in response");
      }
      dispatch(setCredentials({ user: response.data.user, accessToken: response.data.accessToken, tokenVersion: response.data.tokenVersion }));
      return {
        user: response.data.user,
        accessToken: response.data.accessToken,
        tokenVersion: response.data.tokenVersion || tokenVersion + 1
      };
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
      action: PayloadAction<{ user: UserInterface; accessToken: string; tokenVersion: number }>
    ) => {
      console.log("Setting credentials:", action.payload);
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("accessTokenData", JSON.stringify({accessToken:action.payload.accessToken, tokenVersion:action.payload.tokenVersion}));
      localStorage.setItem("sessionActive", "true");
    },
    logout: (state) => {
      console.log("Logging out...");
      state.isAuthenticated = false;
      state.user = null;
      state.lastLocation = null;
      localStorage.removeItem("sessionActive");
      localStorage.removeItem("accessTokenData");
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserInterface>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setUserPersonalization: (state, action: PayloadAction<{ _id: string }>) => {
      if (state.user) {
        (state.user as any).personalization = action.payload._id;
      }
    },
    setLastLocation: (state, action: PayloadAction<string>) => {
      state.lastLocation = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        console.log("Refresh token fulfilled:", action.payload);
        authSlice.caseReducers.setCredentials(state, {
          payload: {
            user: action.payload.user,
            accessToken: action.payload.accessToken,
            tokenVersion: action.payload.tokenVersion,
          },
          type: action.type,
        });
        state.status = "succeeded";
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        console.log("Refresh token rejected");
        state.isAuthenticated = false;
        state.user = null;
        state.lastLocation = null;
        localStorage.removeItem("sessionActive");
      });
  },
});

export const { setCredentials, logout, updateUserProfile, setUserPersonalization, setLastLocation } = authSlice.actions;
export default authSlice.reducer;