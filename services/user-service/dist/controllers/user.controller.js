import { userService } from "@/services/user.service";
export const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id.id);
        res.json({ data: user });
    }
    catch (error) {
        next(error);
    }
};
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.json({ data: users });
    }
    catch (error) {
        next(error);
    }
};
export const createUser = async (req, res, next) => {
    try {
        const body = req.body;
        const user = await userService.createUser(body);
        res.status(201).json({ data: user });
    }
    catch (error) {
        next(error);
    }
};
export const searchUser = async (req, res, next) => {
    try {
        const { query, limit, exclude } = req.query;
        const users = await userService.searchUsers({
            query,
            limits: limit,
            excludeIds: exclude
        });
        res.json({ data: users });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=user.controller.js.map