import { HttpError } from '@chatapp/common';
export const getAuthenticateUser = (req) => {
    if (!req.user) {
        throw new HttpError(401, "Unauthorized");
    }
    return req.user;
};
//# sourceMappingURL=auth.js.map