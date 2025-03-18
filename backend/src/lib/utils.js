// 生成jwt方法
import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {

    // 调用sign方法生成token
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

    // 将jwt token 保存在cookie中，将cookie发送到用户端 有效期7天
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //ms
        httpOnly: true, // 预防xss攻击
        sameSite: "strict", // 预防攻击
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
}