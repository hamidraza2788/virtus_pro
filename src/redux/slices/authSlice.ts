import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserApi, logoutUserApi, registerUserApi, fetchUserApi,sendOTP, verifyOPTData, forgotPasswordData, } from "../../api/authApis";

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
  accessToken:string|null;
  refreshToken:string|null;
  otpResponse:string|null;
  myEmail:string|null;
  schoolId:string|null;

}

const initialState: AuthState = {
  user: null,
  businessProvider:null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken:null,
  refreshToken:null,
  otpResponse:null,
  myEmail:null,
  schoolId:null,
 

};
// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: { name: string; email: string; password: string; phoneNumber: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
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
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Login failed");
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUserApi("token"); // Call API to log out
      return null;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Logout failed");
    }
  }
);

// Fetch User Profile
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {

      const response = await fetchUserApi();

      return response.data;
     
    } catch (error: any) {
      console.log("reddrrr",error?.message)
      return rejectWithValue(error?.message || "Failed to fetch user");
    }
  }
);
// Async thunk for user login
export const sendOPTData = createAsyncThunk(
  "user/sendOTP",
  async (email:{email: string}  , { rejectWithValue }) => {
    try {
      const response = await sendOTP(email);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Login failed");
    }
  }
);
// Async thunk for user login
export const verifyOTP = createAsyncThunk(
  "user/verifyOTP",
  async (data:{email: string,otp:string}  , { rejectWithValue }) => {
    try {
      const response = await verifyOPTData(data);
   
      return response.data;
    } catch (error: any) {
 
      return rejectWithValue(error.message || "OTP verification failed1");
    }
  }
);

// Async thunk for user login
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (data:{email: string,newPassword:string}  , { rejectWithValue }) => {
    try {
      const response = await forgotPasswordData(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "forgot Password  failed");
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
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.schoolId=action.payload.schoolId
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
     
        state.schoolId=action.payload.schoolId
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(sendOPTData.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendOPTData.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(sendOPTData.fulfilled, (state, action) => {
        state.otpResponse=action.payload
        state.loading = false;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
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
     
  },
});
// Export the action
export const { setEmail } = authSlice.actions;
export default authSlice.reducer;
