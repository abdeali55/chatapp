import type { AuthenticateUser } from "@chatapp/common";

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticateUser;
        }
    }
}

export { }