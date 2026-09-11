import { Model, type Optional } from "sequelize";
export interface UsserCredentialsAttributes {
    id: string;
    email: string;
    displayName: string;
    passwordHash: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export type UserCredentialsCreationAttributes = Optional<UsserCredentialsAttributes, "id" | "createdAt" | "updatedAt">;
export declare class UserCredentials extends Model<UsserCredentialsAttributes, UserCredentialsCreationAttributes> implements UsserCredentialsAttributes {
    id: string;
    email: string;
    displayName: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=user-credentials.model.d.ts.map