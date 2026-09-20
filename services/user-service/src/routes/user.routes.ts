import { Router } from "express";
import { asyncHandler,validateRequest } from "@chatapp/common";
import { createUser, getAllUsers, getUser } from "@/controllers/user.controller";
import { createUserSchema, searchUserQuerySchema, userIdParamsSchema } from "@/validation/user.schema";
import { searchUser } from "@/controllers/user.controller";

export const userRouter: Router = Router();

userRouter.get('/', asyncHandler(getAllUsers));
userRouter.get('/search',validateRequest({query: searchUserQuerySchema}), asyncHandler(searchUser));
userRouter.get('/:id',validateRequest({params: userIdParamsSchema}), asyncHandler(getUser));

userRouter.post('/', validateRequest({body: createUserSchema}), asyncHandler(createUser));

