import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = 'http://localhost:5001';

// create用来创建新的状态存储，参数是一个回调函数，返回一个对象定义状态存储的初始状态和更新逻辑，set是一个函数用来更新状态存储中的状态 
export const useAuthStore = create((set, get) => ({
    
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    //每次刷新页面都要check
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            // 接收后端传来的res
            const res = await axiosInstance.get("/auth/check");

            // 修改状态 根据后端传来的User数据
            set({ authUser: res.data });

            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({ authUser: null });
        } finally {
            set ( { isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data});
            toast.success("Account created successfully");

            get().connectSocket();
            
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false});
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");

            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");

        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: async () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected ) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            }
        });
        socket.connect();

        set({ socket: socket});

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds  });
        });
    },

    disconnectSocket: async () => {
        if (get().socket?.connected) {
            get().socket.disconnect(); 
        }
    },
}))