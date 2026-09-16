import { sequelize } from "@/db/sequelize";
import { RefreshToken, UserCredentials } from "@/models";
import { AuthResponse, AuthToken, LoginInput, RegisterInput } from "@/types/auth";
import { hashPassword, signAccessToken, signRefreshToken, verifyPassword, verifyRefreshToken } from "@/utils/token";
import { HttpError } from "@chatapp/common";
import { Op, Transaction } from "sequelize";
import crypto from "node:crypto"
import { publishUserRegistered } from "@/messaging/event-publishing";
import { logger } from "@/utils/logger";

const REFRESH_TOKEN_TTL_DAYS = 30;

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
    const existing = await UserCredentials.findOne({
        where: { email: { [Op.eq]: input.email } }
    });
    if (existing) {
        throw new HttpError(409, "Email already exists")
    }

    const transaction = await sequelize.transaction();
    try {
        const passwordHash = await hashPassword(input.password);
        const user = await UserCredentials.create({
            email: input.email,
            displayName: input.displayName,
            passwordHash
        }, { transaction })

        const refreshTokenRecord = await createRefreshToken(user.id, transaction);
        await transaction.commit();

        const accessToken = signAccessToken({ sub: user.id, email: user.email});

        const refreshToken = signRefreshToken({ sub: user.id, tokenId: refreshTokenRecord.tokenId});

        const userData = {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            createdAt: user.createdAt.toISOString(),
        }

        await publishUserRegistered(userData);

        return {
            accessToken,
            refreshToken,
            user: userData
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const login = async (input: LoginInput): Promise<AuthToken> => {
    const credential = await UserCredentials.findOne({ where: { email: { [Op.eq]: input.email}}})
    if(!credential) {
        throw new HttpError(401, 'Invalid credentials')
    }

    const valid = await verifyPassword(input.password, credential.passwordHash);
    if(!valid) {
        throw new HttpError(401, 'Invalid credentials')
    }

    const refreshTokenRecord = await createRefreshToken(credential.id);

    const accessToken = signAccessToken({ sub: credential.id, email: credential.email});
    const refreshToken = signRefreshToken({ sub: credential.id, tokenId: refreshTokenRecord.tokenId });

    return {
        accessToken,
        refreshToken
    }
    
};

export const refreshTokens = async (token: string):Promise<AuthToken> => {
    const payload = verifyRefreshToken(token);
    const tokenRecord = await RefreshToken.findOne({where: {tokenId: payload.tokenId, userId: payload.sub}});

    if(!tokenRecord || tokenRecord.expiresAt <= new Date()) {
        await tokenRecord?.destroy();
        throw new HttpError(401, 'Invalid or expired refresh token');
    }

    const credentials = await UserCredentials.findByPk(payload.sub);
    if (!credentials) {
        logger.warn({ userId: payload.sub }, 'User missing for refresh token');
        throw new HttpError(401, 'Invalid refresh token');
    }

    await tokenRecord.destroy();
    const newTokenRecord = await createRefreshToken(credentials.id);

    return {
        accessToken: signAccessToken({sub: credentials.id, email: credentials.email}),
        refreshToken: signRefreshToken({sub: credentials.id, tokenId: newTokenRecord.tokenId})
    }
};

export const revokeRefreshToken = async(userId: string) => {
    await RefreshToken.destroy({where: {userId}});
};

const createRefreshToken = async (userId: string, transaction?: Transaction) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

    const tokenId = crypto.randomUUID();

    const record = await RefreshToken.create({
        userId,
        tokenId,
        expiresAt,
    }, { transaction })

    return record;
};