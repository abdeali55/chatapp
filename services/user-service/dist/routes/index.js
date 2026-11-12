import { userRouter } from "./user.routes";
export const registerRoutes = (app) => {
    app.use('/users', userRouter);
};
//# sourceMappingURL=index.js.map