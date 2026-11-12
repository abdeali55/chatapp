import { userProxyService } from "@/services/user.proxy.service";
import { getAuthenticateUser } from "@/utils/auth";
import { createUserSchema, searchUserQuerySchema, userIdParamsSchema } from "@/validation/user.schema";
export const getUser = async (req, res, next) => {
    try {
        const { id } = userIdParamsSchema.parse(req.params);
        const response = await userProxyService.getUserById(id);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
export const getAllUsers = async (req, res, next) => {
    try {
        const response = await userProxyService.getAllUsers();
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
export const createUser = async (req, res, next) => {
    try {
        const payload = createUserSchema.parse(req.body);
        const response = await userProxyService.createUser(payload);
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const searchUsers = async (req, res, next) => {
    try {
        const user = getAuthenticateUser(req);
        const parsedQuery = searchUserQuerySchema.parse(req.query);
        const { query, limit, exclude } = parsedQuery;
        const sanitizedExclude = Array.from(new Set([...exclude, user.id]));
        const users = await userProxyService.searchUsers({
            query,
            limit: limit,
            exclude: sanitizedExclude,
        });
        res.json({ data: users });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=user.controller.js.map