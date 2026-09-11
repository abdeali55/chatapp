import { Sequelize } from "sequelize";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";
export const sequelize = new Sequelize(env.AUTH_DB_URL, {
    dialect: "mysql",
    logging: env.NODE_ENV === "development"
        ? (msg) => {
            logger.debug({ sequelize: msg });
        }
        : false,
    define: {
        underscored: true,
        freezeTableName: true
    },
});
export const connectToDatabase = async () => {
    await sequelize.authenticate();
    logger.info("Connected to Auth database");
};
export const closeDatabase = async () => {
    await sequelize.close();
    logger.info("Auth database connection closed.");
};
//# sourceMappingURL=sequelize.js.map