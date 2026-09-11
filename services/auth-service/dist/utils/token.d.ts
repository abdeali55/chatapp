export declare const hashPassword: (password: string) => Promise<string>;
export declare const verifyPassword: (password: string, hash: string) => Promise<boolean>;
export interface AccessTokenPayload {
    sub: string;
    email: string;
}
export interface RefreshTokenPayload {
    sub: string;
    tokenId: string;
}
export declare const signAccessToken: (payload: AccessTokenPayload) => string;
export declare const signRefreshToken: (payload: RefreshTokenPayload) => string;
export declare const verifyRefreshToken: (payload: string) => RefreshTokenPayload;
//# sourceMappingURL=token.d.ts.map