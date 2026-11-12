import { userRepository } from "@/repositories/user.repositories";
import { HttpError } from "@chatapp/common";
import { UniqueConstraintError } from "sequelize";
import { publishUserCreated } from "@/messaging/event-publisher";
class UserService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getUserById(id) {
        const user = await this.repository.findById(id);
        if (!user)
            throw new HttpError(404, 'USER_NOT_FOUND');
        return user;
    }
    async getAllUsers() {
        return this.repository.findAll();
    }
    async createUser(input) {
        try {
            const user = await this.repository.create(input);
            void publishUserCreated({
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                createdAt: user.createdAt.toISOString(),
            });
            return user;
        }
        catch (error) {
            if (error instanceof UniqueConstraintError)
                throw new HttpError(409, 'Invalid User Input');
            throw error;
        }
    }
    async searchUsers(params) {
        const query = params.query.trim();
        if (query.length === 0)
            return [];
        return this.repository.searchByQuery(query, {
            limit: params.limits, excludeIds: params.excludeIds
        });
    }
    async syncFromAuthUser(payload) {
        const user = await this.repository.upsertFromAuthEvent(payload);
        void publishUserCreated({
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            createdAt: user.createdAt.toISOString(),
        });
        return user;
    }
}
export const userService = new UserService(userRepository);
//# sourceMappingURL=user.service.js.map