import "dotenv/config";
import { z } from "@chatapp/common";
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    GATEWAY_SERVICE_PORT: z.ZodDefault<z.ZodNumber>;
    AUTH_SERVICE_URL: z.ZodString;
    INTERNAL_API_TOKEN: z.ZodString;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    GATEWAY_SERVICE_PORT: number;
    AUTH_SERVICE_URL: string;
    INTERNAL_API_TOKEN: string;
}, {
    NODE_ENV?: "development" | "production" | "test" | undefined;
    GATEWAY_SERVICE_PORT?: number | undefined;
    AUTH_SERVICE_URL: string;
    INTERNAL_API_TOKEN: string;
}>;
type EnvType = z.infer<typeof envSchema>;
export declare const env: EnvType;
export type Env = typeof env;
export {};
//# sourceMappingURL=env.d.ts.map