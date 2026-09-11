import { authRouter } from "@/routes/auth.routes";
export const registerRoutes = (app) => {
    app.use('/auth', authRouter);
};
//# sourceMappingURL=index.js.map