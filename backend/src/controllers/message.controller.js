import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io} from '../lib/socket.js';

// 得到sidebar中会显示的所有User，除了自己,类似于微信联系人列表
export const getUsersForSideBar = async (req, res) => {
    try {
        // 请求用户的id
        const loggedInUserId = req.user._id;

        // 找到除请求用户之外所有的id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.log("Error in getUsersForSiderBar", error.message);
        res.status(500).json({ error: "Internal Server error"});
    }
};

// 得到和某人的聊天记录
export const getMessages = async (req, res) => {
    try {
        // 解构赋值，换成更容易理解的
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        // 在数据库中找到所有Message，它们的senderId是我的id，接收者id是我选取的联系人的id，或者相反，这样能找到所有和联系人的信息
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId, },
                { senderId: userToChatId, receiverId: myId, },
            ]
        });

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ error: "Internal Server error"});
    }
};

// 发送信息，可能是文字或者图片
export const sendMessage = async (req, res) => {
    try {
        const { text, image} = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // 上传图片
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imageUrl,
        });

        // 保存到数据库中
        await newMessage.save();

        // TODO: Realtime functionality goes here => socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // 向接收者发送信息
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal Server error"});     
    }
};