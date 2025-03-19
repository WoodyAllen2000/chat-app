import { create } from "zustand";

// 创建新的状态存储，将主题存储到localStorage
export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        set({ theme })
    },
}));