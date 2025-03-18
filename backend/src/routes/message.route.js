import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSideBar, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// 得到联系人列表
router.get("/users", protectRoute, getUsersForSideBar);

// 得到和某id联系人的所有聊天记录
router.get("/:id", protectRoute, getMessages); 

// 发送信息
router.post("/send/:id", protectRoute, sendMessage);

export default router;