import { Model, Optional } from "sequelize";
export interface RefreshTokenAttributes {
    id: string;
    userId: string;
    tokenId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export type RefreshTokenCreationAttributes = Optional<RefreshTokenAttributes, "id" | "createdAt" | "updatedAt">;
export declare class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
    id: string;
    userId: string;
    tokenId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export default RefreshToken;
//# sourceMappingURL=refresh-token.model.d.ts.map