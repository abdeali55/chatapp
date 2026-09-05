import type { NextFunction, Request, RequestHandler, Response } from "express";
import { error } from "node:console";

export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

const toError = (error: unknown): Error => {
    return error instanceof Error ? error : new Error(String(error));
}

type ErrorForwarder = (error: Error) => void;

const forwardError = (nextFn: ErrorForwarder, error: unknown) => {
    nextFn(toError(error));
}

export const asyncHandler = (handler: AsyncHandler): RequestHandler => {
    return (req, res, next) => {
        void handler(req, res, next).catch((error: unknown) => {
            forwardError(next as ErrorForwarder, error)
        })
    }
}