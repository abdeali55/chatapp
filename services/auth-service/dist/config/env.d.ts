import "dotenv/config";
import { z } from "@chatapp/common";
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    AUTH_SERVICE_PORT: z.ZodDefault<z.ZodNumber>;
    AUTH_DB_URL: z.ZodString;
    JWT_SECRET: z.ZodString;
    JWT_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_SECRET: z.ZodString;
    JWT_REFRESH_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    INTERNAL_AUTH_TOKEN: z.ZodString;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    AUTH_SERVICE_PORT: number;
    AUTH_DB_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;
    INTERNAL_AUTH_TOKEN: string;
}, {
    NODE_ENV?: "development" | "production" | "test" | undefined;
    AUTH_SERVICE_PORT?: number | undefined;
    AUTH_DB_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN?: string | undefined;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN?: string | undefined;
    INTERNAL_AUTH_TOKEN: string;
}>;
type EnvType = z.infer<typeof envSchema>;
export declare const env: EnvType;
export type Env = typeof env;
export {};
//# sourceMappingURL=env.d.ts.map