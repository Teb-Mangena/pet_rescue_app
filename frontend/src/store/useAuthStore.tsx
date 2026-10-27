import { create } from "zustand";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { axiosInstance } from "../config/axios";

// --- Types based on your backend ---
type LoginData = {
  identifier: string;
  password: string;
};

type SignupData = {
  email: string;
  password: string;
};

type OnboardData = {
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  contact_pref_id?: number;
  location_id?: number;
  role: "pet_owner" | "community_member";
};

type IUser = {
  person_id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  role?: "community_member" | "pet_owner" | "manager" | "itadmin";
  is_onboarded?: boolean;
  image_url?: string;
  location_id?: number;
  npo_spca_id?: number | null;
};

type useAuthStoreState = {
  user: IUser | null;

  // Loading states
  isCheckingAuth: boolean;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isOnboarding: boolean;
  isLoggingOut: boolean;

  // Actions
  checkAuth: () => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  onboard: (data: OnboardData) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<useAuthStoreState>((set, get) => ({
  user: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  isOnboarding: false,
  isLoggingOut: false,

  // 1. Check Auth (Runs when app loads)
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/auth/check");
      set({ user: res.data.user });
    } catch (error) {
      set({ user: null });
      console.error("Error in checkAuth:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // 2. Register (Step 1 of Signup)
  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/register", data);

      set({
        user: {
          person_id: res.data.person_id,
          is_onboarded: res.data.is_onboarded,
        },
      });
      toast.success(
        res.data?.message || "Account created. Please complete your profile.",
      );
    } catch (error) {
      let message = "Error signing up";
      if (isAxiosError(error))
        message = error.response?.data?.message || message;
      toast.error(message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // 3. Onboard (Step 2 of Signup)
  onboard: async (data) => {
    try {
      set({ isOnboarding: true });
      const res = await axiosInstance.patch("/auth/onboarding", data);

      set((state) => ({
        user: {
          ...state.user,
          ...res.data,
        } as IUser,
      }));

      toast.success(res.data?.message || "Welcome to the community!");
    } catch (error) {
      let message = "Error during onboarding";
      if (isAxiosError(error))
        message = error.response?.data?.message || message;
      toast.error(message);
    } finally {
      set({ isOnboarding: false });
    }
  },

  // 4. Login
  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);

      await get().checkAuth();

      toast.success(res.data?.message || "Logged in successfully");
    } catch (error) {
      let message = "Failed to log in";
      if (isAxiosError(error))
        message = error.response?.data?.message || message;
      toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // 5. Logout
  logout: async () => {
    try {
      set({ isLoggingOut: true });
      const res = await axiosInstance.post("/auth/logout");

      set({ user: null });
      toast.success(res.data?.message || "Logged out successfully");
    } catch (error) {
      let message = "Failed to logout";
      if (isAxiosError(error))
        message = error.response?.data?.message || message;
      toast.error(message);
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
