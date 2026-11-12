import { Op } from "sequelize";
import { UserModel } from "@/db";
const toDomainUser = (model) => ({
    id: model.id,
    email: model.email,
    displayName: model.displayName,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
});
export class UserRepository {
    async findById(id) {
        const user = await UserModel.findByPk(id);
        return user ? toDomainUser(user) : null;
    }
    async findAll() {
        const users = await UserModel.findAll({
            order: [["displayName", 'ASC']]
        });
        return users.map(toDomainUser);
    }
    async create(data) {
        const user = await UserModel.create(data);
        return toDomainUser(user);
    }
    async searchByQuery(query, options = {}) {
        const where = {
            [Op.or]: [
                {
                    displayName: {
                        [Op.iLike]: `%${query}%`,
                    }
                },
                {
                    email: {
                        [Op.iLike]: `%${query}%`,
                    }
                }
            ]
        };
        if (options.excludeIds && options.excludeIds.length > 0) {
            Object.assign(where, {
                [Op.and]: [{ id: { [Op.notIn]: options.excludeIds } }]
            });
        }
        const users = await UserModel.findAll({
            where,
            order: [['displayName', 'ASC']],
            limit: options.limit
        });
        return users.map(toDomainUser);
    }
    async upsertFromAuthEvent(payload) {
        const [user] = await UserModel.upsert({
            id: payload.id,
            email: payload.email,
            displayName: payload.displayName,
            createdAt: new Date(payload.createdAt),
            updatedAt: new Date(payload.createdAt),
        }, { returning: true });
        return toDomainUser(user);
    }
}
export const userRepository = new UserRepository();
//# sourceMappingURL=user.repositories.js.map