import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserApi, logoutUserApi, registerUserApi, fetchUserApi, forgotPasswordApi, resetPasswordApi, updateProfileApi, updateProfileWithImageApi, socialLoginApi } from "../../api/authApis";
import StorageUtils from "../../utils/storage";

export interface ProviderItem {
  id: string;
  organizationName: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}
interface AuthState {
  user: any | null;
  businessProvider: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  otpResponse: string | null;
  myEmail: string | null;
  schoolId: string | null;
}

const initialState: AuthState = {
  user: null,
  businessProvider: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  otpResponse: null,
  myEmail: null,
  schoolId: null,
};
// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: { first_name: string; last_name: string; email: string; password: string; phone?: string; address?: string }, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      const { user } = response.data;
      
      // Save authentication data to localStorage (no token needed)
      await StorageUtils.saveAuthData(user, '', '');
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Registration failed");
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(credentials);
      const { user } = response.data;
      
      // Save authentication data to localStorage (no token needed)
      await StorageUtils.saveAuthData(user, '', '');
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Login failed");
    }
  }
);

// Async thunk for social login (Google Sign-In)
export const socialLogin = createAsyncThunk(
  "auth/socialLogin",
  async (userData: { email: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await socialLoginApi(userData);
      const { user } = response.data;
      
      // Save authentication data to localStorage (no token needed)
      await StorageUtils.saveAuthData(user, '', '');
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Social login failed");
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // Clear localStorage data
      await StorageUtils.clearAuthData();
      
      // Call API to log out (no token needed)
      try {
        await logoutUserApi();
      } catch (apiError) {
        console.log('API logout failed, but localStorage cleared:', apiError);
      }
      
      return null;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Logout failed");
    }
  }
);

// Fetch User Profile (removed - no profile endpoint in backend)
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      // Since there's no profile endpoint, get user data from localStorage
      const userData = await StorageUtils.getUserData();
      if (userData) {
        return { user: userData };
      } else {
        return rejectWithValue("No user data found");
      }
    } catch (error: any) {
      console.log("Error fetching user:", error?.message);
      return rejectWithValue(error?.message || "Failed to fetch user");
    }
  }
);
// Async thunk for forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordApi(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to send reset email");
    }
  }
);

// Custom logger for Redux
const logRedux = (message: string, data?: any) => {
  console.log(`[REDUX_AUTH] ${message}`, data || '');
  if (__DEV__) {
    console.warn(`[REDUX_AUTH] ${message}`, data || '');
  }
};

// Async thunk for reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: { otp: string; new_password: string }, { rejectWithValue }) => {
    try {
      logRedux('Calling resetPasswordApi with data:', data);
      const response = await resetPasswordApi(data);
      logRedux('resetPasswordApi response:', response);
      return response;
    } catch (error: any) {
      logRedux('resetPasswordApi error:', error);
      logRedux('Error response:', error.response);
      logRedux('Error message:', error.message);
      return rejectWithValue(error?.message || "Password reset failed");
    }
  }
);

// Async thunk for update profile (without image)
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: { user_id: number; first_name?: string; last_name?: string; phone?: string; address?: string }, { rejectWithValue }) => {
    try {
      logRedux('Calling updateProfileApi with data:', profileData);
      const response = await updateProfileApi(profileData);
      logRedux('updateProfileApi response:', response);
      
      // Update localStorage with new user data
      if (response.data.user) {
        await StorageUtils.saveUserData(response.data.user);
      }
      
      return response;
    } catch (error: any) {
      logRedux('updateProfileApi error:', error);
      return rejectWithValue(error?.message || "Profile update failed");
    }
  }
);

// Async thunk for update profile with image
export const updateProfileWithImage = createAsyncThunk(
  "auth/updateProfileWithImage",
  async (data: { 
    profileData: { user_id: number; first_name?: string; last_name?: string; phone?: string; address?: string };
    imageUri?: string;
  }, { rejectWithValue }) => {
    try {
      logRedux('Calling updateProfileWithImageApi with data:', data);
      const response = await updateProfileWithImageApi(data.profileData, data.imageUri);
      logRedux('updateProfileWithImageApi response:', response);
      
      // Update localStorage with new user data including profile image
      if (response.data.user) {
        await StorageUtils.saveUserData(response.data.user);
      }
      
      return response;
    } catch (error: any) {
      logRedux('updateProfileWithImageApi error:', error);
      return rejectWithValue(error?.message || "Profile update with image failed");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.myEmail = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Also clear localStorage
      StorageUtils.clearAuthData().catch(console.error);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(socialLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.schoolId = null; // Not part of the API response
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      // Profile update reducers
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update user data in Redux state
        if (action.payload.data.user) {
          state.user = action.payload.data.user;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Profile update with image reducers
      .addCase(updateProfileWithImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileWithImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update user data in Redux state including profile image
        if (action.payload.data.user) {
          state.user = action.payload.data.user;
        }
      })
      .addCase(updateProfileWithImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
     
  },
});
// Export the actions
export const { setEmail, clearAuth } = authSlice.actions;
export default authSlice.reducer;

// Export async thunks
export { updateProfile, updateProfileWithImage };
