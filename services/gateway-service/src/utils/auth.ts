import { HttpError, type AuthenticateUser, USER_ID_HEADER } from '@chatapp/common';

import type { Request } from 'express';

export const getAuthenticateUser = (req: Request): AuthenticateUser => {
    if (!req.user) {
        throw new HttpError(401, "Unauthorized");
    }
    return req.user
}

