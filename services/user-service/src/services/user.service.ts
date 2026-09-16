import type { UserRepository } from "@/repositories/user.repositories";
import type { CreateUserInput, User } from "@/types/user";

import { sequelize } from "@/db";
import { userRepository } from "@/repositories/user.repositories";
import { AuthUserRegisteredPayload } from "@chatapp/common";

class UserService {
    constructor(private readonly repository: UserRepository) {

    }

    async syncFromAuthUser(payload: AuthUserRegisteredPayload): Promise<User> {
        const user = await this.repository.upsertFromAuthEvent(payload);

        return user; 
    }
}

export const userService = new UserService(userRepository);
