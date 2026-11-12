import { authRouter } from "@/routes/auth.routes";
import { userRouter } from "@/routes/user.routes";
export const registerRoutes = (app) => {
    app.use('/auth', authRouter);
    app.use('/users', userRouter);
};
//# sourceMappingURL=index.js.map