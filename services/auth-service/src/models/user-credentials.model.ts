import { DataTypes, Model, type Optional} from "sequelize"
import { sequelize } from "@/db/sequelize"

export interface UsserCredentialsAttributes {
    id: string;
    email: string;
    displayName: string;
    passwordHash: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserCredentialsCreationAttributes = Optional< UsserCredentialsAttributes, "id" | "createdAt" | "updatedAt">;

export class UserCredentials 
    extends Model<UsserCredentialsAttributes, UserCredentialsCreationAttributes>
    implements UsserCredentialsAttributes {
        declare id: string;
        declare email: string;
        declare displayName: string;
        declare passwordHash: string;
        declare createdAt: Date;
        declare updatedAt: Date;
    }   

UserCredentials.init(
    {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
},
{
    sequelize,
    tableName: "user_credentials",
})
