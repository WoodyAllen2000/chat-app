import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// 用来存储在线用户
const userSocketMap = {}; // {userId: socketId}

// 监听客户端连接
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // 获得连接的用户的id   
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] =socket.id;
    };

    // io.emit() 用来向所有连接的用户传达事件
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); 

    // 监听客户端断开
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);

        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); 
    })
})

export { io, app, server };
