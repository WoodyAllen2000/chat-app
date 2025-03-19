import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

dotenv.config(); 

// 创建Express.js应用实例
const app = express();

const PORT = process.env.PORT;

// 当客户端发送请求时，express.json()会解析请求Json数据，并将解析后的结果放入到req.body中
app.use(express.json());

// 让我能够解析cookie
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

// use用于挂载中间件 当请求的 URL 以 /api/auth 开头时，Express 会将请求传递给 authRoutes 中定义的路由处理逻辑。
app.use("/api/auth", authRoutes);

// 挂载 将请求传递给messageRoutes中定义的路由处理逻辑。
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log("Server is running on PORT:" + PORT);
    connectDB();
}); 