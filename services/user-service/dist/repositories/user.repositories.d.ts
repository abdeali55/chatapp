import type { CreateUserInput, User } from "@/types/user";
import type { AuthUserRegisteredPayload } from "@chatapp/common";
export declare class UserRepository {
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(data: CreateUserInput): Promise<User>;
    searchByQuery(query: string, options?: {
        limit?: number;
        excludeIds?: string[];
    }): Promise<User[]>;
    upsertFromAuthEvent(payload: AuthUserRegisteredPayload): Promise<User>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=user.repositories.d.ts.map