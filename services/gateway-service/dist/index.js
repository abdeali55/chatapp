import { createApp } from "./app";
import { createServer } from "node:http";
import { env } from "./config/env";
import { logger } from "./utils/logger";
const main = async () => {
    try {
        const app = createApp();
        const server = createServer(app);
        const port = env.GATEWAY_SERVICE_PORT;
        server.listen(port, () => {
            logger.info({ port }, "Gateway service is running...");
        });
        const shutdown = async () => {
            logger.info("Shutting down gateway service...");
            Promise.all([])
                .catch((error) => {
                logger.error({ error }, "Error during shutdown tasks");
            })
                .finally(() => {
                server.close(() => process.exit(0));
            });
        };
        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);
    }
    catch (error) {
        logger.error({ error }, "Failed to start gateway service");
        process.exit(1);
    }
    ;
};
main();
//# sourceMappingURL=index.js.map