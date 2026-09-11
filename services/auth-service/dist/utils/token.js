import { env } from "@/config/env";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const ACCESS_TOKEN = env.JWT_SECRET;
const REFRESH_TOKEN = env.JWT_REFRESH_SECRET;
const ACCESS_OPTIONS = { expiresIn: env.JWT_EXPIRES_IN };
const REFRESH_OPTIONS = { expiresIn: env.JWT_REFRESH_EXPIRES_IN };
export const hashPassword = async (password) => {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
};
export const verifyPassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};
export const signAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN, ACCESS_OPTIONS);
};
export const signRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN, REFRESH_OPTIONS);
};
export const verifyRefreshToken = (payload) => {
    return jwt.verify(payload, REFRESH_TOKEN);
};
//# sourceMappingURL=token.js.map