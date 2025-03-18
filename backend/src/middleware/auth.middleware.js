import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// 创建中间件 protectRoute next是一个函数，用于将请求传递给下一个中间件或路由处理器
export const protectRoute = async (req, res, next) => {
    try {
        // 从cookie中获取token
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        // 调用verify方法 解密token 之前userId作为payload 被加密为token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        // 通过 userId 查询结果，并在结果中剔除password
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 将数据库中查询得到的user，并将其赋到req请求上
        req.user = user;

        next();


    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Initial server error" });
    }
}
