import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL); /* 创建连接 */
        console.log(`Mongo DB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('Mongo DB connection error:', error);
    }
};
 