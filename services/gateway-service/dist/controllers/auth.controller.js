import { authProxyService } from "@/services/auth-proxy.service";
import { registerSchema } from "@/validation/auth.schema";
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
//# sourceMappingURL=auth.controller.js.map