import { createUser, getAllUsers, searchUsers, getUser } from "@/controllers/user.controller";
import { requireAuth } from "@/middleware/require-auth";
import { createUserSchema, searchUserQuerySchema, userIdParamsSchema } from "@/validation/user.schema";
import { asyncHandler, validateRequest } from "@chatapp/common";
import { Router } from "express";


export const userRouter: Router = Router();

userRouter.get("/", requireAuth, asyncHandler(getAllUsers));
userRouter.get("/search", requireAuth, validateRequest({query: searchUserQuerySchema}), asyncHandler(searchUsers));
userRouter.get("/:id", requireAuth, validateRequest({params: userIdParamsSchema }), asyncHandler(getUser));
userRouter.put("/status", validateRequest({ body: createUserSchema}), asyncHandler(createUser));

