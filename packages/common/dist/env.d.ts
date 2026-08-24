import type { ZodObject, ZodRawShape } from "zod";
interface EnvOptions {
    source?: NodeJS.ProcessEnv;
    service?: string;
}
type SchemaOutput<TSchema extends ZodRawShape> = ZodObject<TSchema>["_output"];
export declare const createEnv: <TSchema extends ZodRawShape>(schema: ZodObject<TSchema>, options?: EnvOptions) => SchemaOutput<TSchema>;
export type EnvSchema<TShape extends ZodRawShape> = ZodObject<TShape>;
export {};
//# sourceMappingURL=env.d.ts.map