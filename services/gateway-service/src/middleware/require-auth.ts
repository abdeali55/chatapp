import { HttpError, type AuthenticateUser } from "@chatapp/common";

import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import { env } from "@/config/env";

interface AccessTokenClaims {
    sub: string;
    email?: string;
}

const parseAuthorizationHeader = (value: string | undefined): string => {
    if (!value) throw new HttpError(401, 'Unauthorized');

    const [scheme, token] = value.split(' ');

    if(scheme.toLowerCase() !== "bearer" || !token) {
        throw new HttpError(401, "Unauthorized");
    }

    return token;
}