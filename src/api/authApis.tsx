import { axiosInstance } from "./axiosInstance";


// Register User
export const registerUserApi = async (userData: any) => {
    try {
        const res = await axiosInstance.post("/user/register", userData);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Registeration failed");
    }
};

// Login User
export const loginUserApi = async (credentials: any) => {
    try {
        const res = await axiosInstance.post("/user/login", credentials, {
            withCredentials: true,
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Login failed");
    }
};

// Logout User
export const logoutUserApi = async (token: string) => {
    try {
      const response = await axiosInstance.post(
        "/user/logout",
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass access token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Logout failed");
    }
  };

// Fetch User Profile
export const fetchUserApi = async () => {
    try {
        const res = await axiosInstance.get("/user/profile");
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

// sendOTP
export const sendOTP = async (email: any) => {
  try {
      const res = await axiosInstance.post("/user/send-otp", email, {
          withCredentials: true,
      });
      return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
};

// sendOTP
export const verifyOPTData = async (data: any) => {
    try {
      
        const res = await axiosInstance.post("/user/verify-otp", data);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "OTP verification failed");
    }
  };

  // sendOTP
export const forgotPasswordData = async (data: any) => {
    try {
        const res = await axiosInstance.post("/user/forgot-password", data);
     
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "OTP verification failed");
    }
  };



