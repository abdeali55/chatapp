import { register } from "@/services/auth.service";
import { asyncHandler } from "@chatapp/common";
export const registerHandler = asyncHandler(async (req, res) => {
    const payload = req.body;
    const tokens = await register(payload);
    res.status(201).json(tokens);
});
//# sourceMappingURL=auth.controller.js.map