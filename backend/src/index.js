import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";

dotenv.config(); 

const app = express();

const PORT = process.env.PORT;

// use用于挂载中间件 当请求的 URL 以 /api/auth 开头时，Express 会将请求传递给 authRoutes 中定义的路由处理逻辑。
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log("Server is running on PORT:" + PORT);
    connectDB();
}); 