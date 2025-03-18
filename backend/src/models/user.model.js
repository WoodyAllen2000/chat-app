import mongoose from "mongoose";
// 引入mangoose 对象映射工具ORM

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },

        fullname: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        profilePic: {
            type: String,
            default: "",
        },
    },

    // Mangoose选项 表示自动添加createdAt和updatedAt字段 自动更新
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;
