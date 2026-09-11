import { HttpError } from "@chatapp/common";
import { logger } from "@/utils/logger";
export const errorHandler = (err, req, res, next) => {
    logger.error({ err }, "Unhandled error occured");
    const error = err instanceof HttpError ? err : undefined;
    const statusCode = error?.statusCode ?? 500;
    const message = statusCode >= 500 ? "Internal Server Error" : error?.message ?? "Unknown Error";
    const payload = error?.details ? { message, details: error.details } : {
        message
    };
    res.status(statusCode).json(payload);
    void next();
};
//# sourceMappingURL=error-handler.js.map