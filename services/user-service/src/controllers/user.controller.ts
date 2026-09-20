import { userService } from "@/services/user.service";
import { CreateUserBody, SearchUserQuery, UserIdParams } from "@/validation/user.schema";
import type { AsyncHandler } from "@chatapp/common";

export const getUser: AsyncHandler = async(req, res, next)=>{
    try {
        const { id } = req.params as unknown as {id: UserIdParams};
        const user = await userService.getUserById(id.id);
        res.json({data: user});
    } catch (error) {
        next(error)
    }
}

export const getAllUsers: AsyncHandler = async(req, res, next)=>{
    try {
        const users = await userService.getAllUsers();
        res.json({data: users});
    } catch (error) {
        next(error);
    }
}

export const createUser: AsyncHandler = async(req, res, next)=>{
    try {
        const body = req.body as unknown as CreateUserBody;
        const user = await userService.createUser(body);
        res.status(201).json({data: user});
    } catch (error) {
        next(error);
    }
}

export const searchUser: AsyncHandler = async(req, res, next)=>{
    try {
        const {query, limit, exclude} = req.query as unknown as SearchUserQuery;
        const users = await userService.searchUsers({
            query,
            limits: limit,
            excludeIds: exclude
        })
        res.json({data: users});
    } catch (error) {
        next(error);
    }
}

