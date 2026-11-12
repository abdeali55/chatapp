import { authProxyService } from "@/services/auth-proxy.service";
import { loginSchema, refreshSchema, registerSchema, revokeSchema } from "@/validation/auth.schema";
export const registerUser = async (req, res, next) => {
    try {
        const payload = registerSchema.parse(req.body);
        const response = await authProxyService.register(payload);
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const loginUser = async (req, res, next) => {
    try {
        const payload = loginSchema.parse(req.body);
        const tokens = await authProxyService.login(payload);
        res.json(tokens);
    }
    catch (error) {
        next(error);
    }
};
export const refreshToken = async (req, res, next) => {
    try {
        const payload = refreshSchema.parse(req.body);
        const tokens = await authProxyService.refresh(payload);
        res.json(tokens);
    }
    catch (error) {
        next(error);
    }
};
export const revokeToken = async (req, res, next) => {
    try {
        const payload = revokeSchema.parse(req.body);
        await authProxyService.revoke(payload);
        res.status(200).json({ message: "Token revoked successfully" });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.controller.js.map