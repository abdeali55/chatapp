import { sequelize } from "@/db/sequelize";
import { RefreshToken, UserCredentials } from "@/models";
import { hashPassword, signAccessToken, signRefreshToken } from "@/utils/token";
import { HttpError } from "@chatapp/common";
import { Op } from "sequelize";
import crypto from "node:crypto";
const REFRESH_TOKEN_TTL_DAYS = 30;
export const register = async (input) => {
    const existing = await UserCredentials.findOne({
        where: { email: { [Op.eq]: input.email } }
    });
    if (existing) {
        throw new HttpError(409, "Email already exists");
    }
    const transaction = await sequelize.transaction();
    try {
        const passwordHash = await hashPassword(input.password);
        const user = await UserCredentials.create({
            email: input.email,
            displayName: input.displayName,
            passwordHash
        }, { transaction });
        const refreshTokenRecord = await createRefreshToken(user.id, transaction);
        await transaction.commit();
        const accessToken = signAccessToken({ sub: user.id, email: user.email });
        const refreshToken = signRefreshToken({ sub: user.id, tokenId: refreshTokenRecord.tokenId });
        const userData = {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            createdAt: user.createdAt.toISOString(),
        };
        return {
            accessToken,
            refreshToken,
            user: userData
        };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const createRefreshToken = async (userId, transaction) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);
    const tokenId = crypto.randomUUID();
    const record = await RefreshToken.create({
        userId,
        tokenId,
        expiresAt,
    }, { transaction });
    return record;
};
//# sourceMappingURL=auth.service.js.map