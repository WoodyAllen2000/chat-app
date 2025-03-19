import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

// 和用户和信息相关的状态存储
export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false, 


    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("messages/users");
            set({ users: res.data })
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        // 没办法直接得到状态，调用get
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data,] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    // TODO: optimize it later
    // 选取要进行对话的用户
    setSelectedUser: (selectedUser) => {
        set({ selectedUser: selectedUser });
    }
}))
