import { create } from "zustand";
import axios from "../libs/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: false,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data });
      toast.success("User created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ loading: false });
      console.log(get("user"));
    }
  },
  signin: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/signin", { email, password });
      set({ user: res.data });
      toast.success("Signed in successfully");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ loading: false });
      console.log(get("user"));
    }
  },

  signout: async () => {
    set({ loading: true });
    try {
      await axios.post("/auth/signout");
      set({ user: null });
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during signout"
      );
    } finally {
      set({ loading: false });
      console.log(get("user"));
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data });
    } catch (error) {
      console.log(error.message);
      set({ user: null });
    } finally {
      set({ checkingAuth: false });
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-access-token");
      return response.data;
    } catch (error) {
      set({ user: null });
      throw error;
    } finally {
      set({ checkingAuth: false });
    }
  },
}));

// TODO: Implement the axios interceptors for refreshing access token

// Axios interceptor for token refresh
let refreshPromise = null;
const REFRESH_TIMEOUT = 10000; // 10秒超时

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 清理函数
      const cleanup = () => {
        refreshPromise = null;
      };

      try {
        if (refreshPromise) {
          await Promise.race([
            refreshPromise,
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("刷新超时")), REFRESH_TIMEOUT)
            ),
          ]);
          return axios(originalRequest);
        }

        // 设置超时自动清理
        const timeoutId = setTimeout(cleanup, REFRESH_TIMEOUT);
        refreshPromise = useUserStore
          .getState()
          .refreshToken()
          .finally(() => {
            clearTimeout(timeoutId);
            cleanup();
          });

        await refreshPromise;
        return axios(originalRequest);
      } catch (refreshError) {
        cleanup();
        useUserStore.getState().signout();
        window.location.href = "/signin"; // 明确跳转登录页
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
