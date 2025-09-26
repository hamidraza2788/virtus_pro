import { Alert } from "react-native";
import { axiosInstance } from "./axiosInstance";

// Types for API responses
interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  otp: string;
  new_password: string;
}

interface UpdateProfileRequest {
  user_id: number;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
}

interface UpdateProfileResponse {
  status: number;
  message: string;
  timestamp: string;
  data: {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      address?: string;
      profile_image?: string;
      created_at: string;
      profile_image_url?: string;
    };
    updated_fields: string[];
  };
}

interface SocialLoginRequest {
  email: string;
  name: string;
}

interface SocialLoginResponse {
  status: number;
  message: string;
  timestamp: string;
  data: {
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      address?: string;
      profile_image?: string;
      created_at: string | null;
    };
  };
}

interface AuthResponse {
  status: number;
  message: string;
  timestamp: string;
  data: {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      address?: string;
      created_at: string;
    };
  };
}

// Register User
export const registerUserApi = async (userData: RegisterRequest) => {
    try {
        const res = await axiosInstance.post("/register.php", userData);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Registration failed");
    }
};

// Login User
export const loginUserApi = async (credentials: LoginRequest) => {
    try {
        const res = await axiosInstance.post("/login.php", credentials);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Login failed");
    }
};

// Forgot Password
export const forgotPasswordApi = async (data: ForgotPasswordRequest) => {
    try {
        const res = await axiosInstance.post("/forgot-password.php", data);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to send reset email");
    }
};

// Custom logger for API
const logAPI = (message: string, data?: any) => {
    console.log(`[API_AUTH] ${message}`, data || '');
    if (__DEV__) {
        console.warn(`[API_AUTH] ${message}`, data || '');
    }
};

// Reset Password
export const resetPasswordApi = async (data: ResetPasswordRequest) => {
    try {
        logAPI('Making API call to reset-password.php with data:', data);
        const res = await axiosInstance.post("/reset-password.php", data);
        logAPI('API response:', res.data);
        return res.data;
    } catch (error: any) {
        logAPI('API error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            statusText: error.response?.statusText
        });
        throw new Error(error.response?.data?.message || "Password reset failed");
    }
};

// Logout User (local logout only - no server endpoint needed)
export const logoutUserApi = async () => {
    try {
      // Since backend doesn't require logout endpoint, we just return success
      // The actual logout is handled by clearing localStorage
      return { status: 200, message: "Logged out successfully" };
    } catch (error: any) {
      throw new Error("Logout failed");
    }
};

// Fetch User Profile (removed - no profile endpoint in backend)
// Since backend doesn't have a profile endpoint, we'll rely on localStorage data
export const fetchUserApi = async () => {
    try {
        // Return null since there's no profile endpoint
        // Profile data is managed through localStorage
        return null;
    } catch (error: any) {
        throw error;
    }
};

// Update Profile (JSON - without image)
export const updateProfileApi = async (profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    try {
        logAPI('Making API call to update-profile.php with data:', profileData);
        const res = await axiosInstance.put("/update-profile.php", profileData);
        logAPI('Profile update API response:', res.data);
        return res.data;
    } catch (error: any) {
        logAPI('Profile update API error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            statusText: error.response?.statusText
        });
        throw new Error(error.response?.data?.message || "Profile update failed");
    }
};

// Update Profile with Image (File Upload)
export const updateProfileWithImageApi = async (
    profileData: UpdateProfileRequest,
    imageUri?: string
): Promise<UpdateProfileResponse> => {
    try {
        logAPI('Making API call to update-profile.php with image upload');
        
        // Create FormData for file upload
        const formData = new FormData();
        
        // Add profile data (including user_id)
        Object.entries(profileData).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value.toString()); // Convert user_id to string for FormData
            }
        });
        
        // Add image if provided
        if (imageUri) {
            formData.append('profile_image', {
                uri: imageUri,
                type: 'image/jpeg', // You can determine this based on file extension
                name: 'profile_image.jpg',
            } as any);
        }
        
        logAPI('FormData created with fields:', Object.keys(profileData));
        
        const res = await axiosInstance.post("/update-profile.php", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        logAPI('Profile update with image API response:', res.data);
        return res.data;
    } catch (error: any) {
        logAPI('Profile update with image API error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            statusText: error.response?.statusText
        });
        throw new Error(error.response?.data?.message || "Profile update with image failed");
    }
};

// Social Login (Google Sign-In)
// export const socialLoginApi = async (userData: SocialLoginRequest): Promise<SocialLoginResponse> => {
//     try {
//         logAPI('Making API call to social-login.php with data:', userData);
//         logAPI('Base URL:', axiosInstance.defaults.baseURL);
//         logAPI('Full URL:', `${axiosInstance.defaults.baseURL}/social-login.php`);
        
//         const res = await axiosInstance.post("/social-login.php", userData);
//         logAPI('Social login API response:', res.data);
//         return res.data;
//     } catch (error: any) {
//         logAPI('Social login API error details:', {
//             message: error.message,
//             response: error.response?.data,
//             status: error.response?.status,
//             statusText: error.response?.statusText,
//             url: error.config?.url,
//             baseURL: error.config?.baseURL
//         });
//         throw new Error(error.response?.data?.message || "Social login failed");
//     }
// };
export const socialLoginApi = async (credentials: SocialLoginRequest) => {
    try {
        const res = await axiosInstance.post("/social-login.php", credentials);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Social login failed");
    }
};



