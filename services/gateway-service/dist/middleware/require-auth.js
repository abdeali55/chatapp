import { HttpError } from "@chatapp/common";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
const parseAuthorizationHeader = (value) => {
    if (!value)
        throw new HttpError(401, 'Unauthorized');
    const [scheme, token] = value.split(' ');
    if (scheme.toLowerCase() !== "bearer" || !token) {
        throw new HttpError(401, "Unauthorized");
    }
    return token;
};
const toAuthenticateUser = (claims) => {
    if (!claims.sub) {
        throw new HttpError(401, 'Unauthorized');
    }
    return {
        id: claims.sub,
        email: claims.email,
    };
};
export const requireAuth = async (req, res, next) => {
    try {
        const token = parseAuthorizationHeader(req.headers.authorization);
        const claims = jwt.verify(token, env.JWT_SECRET);
        req.user = toAuthenticateUser(claims);
        next();
    }
    catch (error) {
        if (error instanceof HttpError) {
            next(error);
        }
        else {
            next(new HttpError(401, 'Unauthorized'));
        }
    }
};
//# sourceMappingURL=require-auth.js.map