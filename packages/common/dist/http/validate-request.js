import { HttpError } from "../errors/http-error";
import { ZodError } from "zod";
const formatedZodError = (error) => error.errors.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
}));
export const validateRequest = (schemas) => {
    return (req, _res, next) => {
        try {
            if (schemas.body) {
                const parsedBody = schemas.body.parse(req.body);
                req.body = parsedBody;
            }
            if (schemas.params) {
                const parsedParams = schemas.params.parse(req.params);
                req.params = parsedParams;
            }
            if (schemas.query) {
                const parsedQuery = schemas.query.parse(req.query);
                req.query = parsedQuery;
            }
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                next(new HttpError(422, "Invalid resquest", { issues: formatedZodError(error) }));
                return;
            }
            next(error);
        }
    };
};
//# sourceMappingURL=validate-request.js.map