import { registerUser } from "@/controllers/auth.controller";
import { registerSchema } from "@/validation/auth.schema";
import { asyncHandler, validateRequest } from "@chatapp/common";
import { Router } from "express";
export const authRouter = Router();
authRouter.post('/register', validateRequest({ body: registerSchema }), asyncHandler(registerUser));
//# sourceMappingURL=auth.routes.js.map