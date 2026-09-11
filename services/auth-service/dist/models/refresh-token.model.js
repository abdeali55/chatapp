import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/db/sequelize";
import { UserCredentials } from "./user-credentials.model";
export class RefreshToken extends Model {
}
RefreshToken.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    tokenId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    tableName: "refresh_token"
});
UserCredentials.hasMany(RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
RefreshToken.belongsTo(UserCredentials, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
export default RefreshToken;
//# sourceMappingURL=refresh-token.model.js.map