import { createApp } from "./app";
import { createServer } from "node:http";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { initializeDatabase } from "./db/sequelize";
import { startAuthEventConsumer } from "./messaging/auth-consumer";


const main = async () => {
    try {

        await initializeDatabase();
        await startAuthEventConsumer();

        const app = createApp();
        const server = createServer(app);
        const port = env.USER_SERVICE_PORT;
        server.listen(port, () => {
            logger.info({ port }, "User service is running...");
        });

        const shutdown = async () => {
            logger.info("Shutting down user service...");

            Promise.all([])
                .catch((error: unknown) => {
                    logger.error({error}, "Error during shutdown tasks")
                })
                .finally(() => {
                    server.close(() => process.exit(0));
                })
        };

        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);
        
    } catch (error) {
        logger.error({error}, "Failed to start user service");
        process.exit(1)
    };
}

main();