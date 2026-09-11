import { authRouter } from "./auth.routes";
export const registerRoutes = (app) => {
    app.use("/auth", authRouter);
};
//# sourceMappingURL=index.js.map