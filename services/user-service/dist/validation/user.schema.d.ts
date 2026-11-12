import { z } from "@chatapp/common";
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    displayName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    displayName: string;
}, {
    email: string;
    displayName: string;
}>;
export declare const userIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const searchUserQuerySchema: z.ZodObject<{
    query: z.ZodString;
    limit: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber]>, number, string | number>, number, string | number>>;
    exclude: z.ZodUnion<[z.ZodArray<z.ZodString, "many">, z.ZodEffects<z.ZodOptional<z.ZodEffects<z.ZodString, string[], string>>, string[], string | undefined>]>;
}, "strip", z.ZodTypeAny, {
    query: string;
    limit?: number | undefined;
    exclude: string[];
}, {
    query: string;
    limit?: string | number | undefined;
    exclude?: string | string[] | undefined;
}>;
export type SearchUserQuery = z.infer<typeof searchUserQuerySchema>;
export type CreateUserBody = z.infer<typeof createUserSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
//# sourceMappingURL=user.schema.d.ts.map