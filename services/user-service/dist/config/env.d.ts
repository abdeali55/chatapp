import "dotenv/config";
import { z } from "@chatapp/common";
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    USER_SERVICE_PORT: z.ZodDefault<z.ZodNumber>;
    USER_DB_URL: z.ZodString;
    RABBITMQ_URL: z.ZodOptional<z.ZodString>;
    INTERNAL_API_TOKEN: z.ZodString;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    USER_SERVICE_PORT: number;
    USER_DB_URL: string;
    RABBITMQ_URL?: string | undefined;
    INTERNAL_API_TOKEN: string;
}, {
    NODE_ENV?: "development" | "production" | "test" | undefined;
    USER_SERVICE_PORT?: number | undefined;
    USER_DB_URL: string;
    RABBITMQ_URL?: string | undefined;
    INTERNAL_API_TOKEN: string;
}>;
type EnvType = z.infer<typeof envSchema>;
export declare const env: EnvType;
export type Env = typeof env;
export {};
//# sourceMappingURL=env.d.ts.map