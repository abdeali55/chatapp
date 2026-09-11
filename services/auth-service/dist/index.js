import { createApp } from "./app";
import { createServer } from "node:http";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { connectToDatabase, closeDatabase } from "@/db/sequelize";
import { initModels } from "./models";
const main = async () => {
    try {
        await connectToDatabase();
        await initModels();
        const app = createApp();
        const server = createServer(app);
        const port = env.AUTH_SERVICE_PORT;
        server.listen(port, () => {
            logger.info({ port }, "Auth service is running...");
        });
        const shutdown = async () => {
            logger.info("Shutting down auth service...");
            Promise.all([closeDatabase()]).catch((error) => {
                logger.error({ error }, "Error during shutdown tasks");
            }).finally(() => {
                server.close(() => process.exit(0));
            });
        };
        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);
    }
    catch (error) {
        logger.error({ error }, "Failed to start auth service");
        process.exit(1);
    }
    ;
};
main();
//# sourceMappingURL=index.js.map