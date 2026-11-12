import type { UserRepository } from "@/repositories/user.repositories";
import type { CreateUserInput, User } from "@/types/user";
import { AuthUserRegisteredPayload } from "@chatapp/common";
declare class UserService {
    private readonly repository;
    constructor(repository: UserRepository);
    getUserById(id: string): Promise<User>;
    getAllUsers(): Promise<User[]>;
    createUser(input: CreateUserInput): Promise<User>;
    searchUsers(params: {
        query: string;
        limits?: number;
        excludeIds?: string[];
    }): Promise<User[]>;
    syncFromAuthUser(payload: AuthUserRegisteredPayload): Promise<User>;
}
export declare const userService: UserService;
export {};
//# sourceMappingURL=user.service.d.ts.map