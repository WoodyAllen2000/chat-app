// 路由模块实现 身份验证相关路由
import express from 'express';
import { updateProfile, checkAuth, login, logout, signup } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

// 只有登录后的用户才能更新 添加中间件保护 profile put请求用来更新资源
router.put("/update-profile", protectRoute, updateProfile);

// 每次刷新页面后调用
router.get("/check", protectRoute, checkAuth); 

export default router;