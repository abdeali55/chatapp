import { connect } from "amqplib";
import { AUTH_EVENT_EXCHANGE, AUTH_USER_REGISTERED_ROUTING_KEY } from "@chatapp/common";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { userService } from "@/services/user.service";
let ConnectionRef = null;
let channel = null;
let consumerTag = null;
const QUEUE_NAME = 'auth-service.auth-event';
const closeConnection = async (conn) => {
    await conn.close();
    ConnectionRef = null;
    channel = null;
    consumerTag = null;
};
const handleMessage = async (message, ch) => {
    const raw = message.content.toString('utf-8');
    const event = JSON.parse(raw);
    await userService.syncFromAuthUser(event.payload);
    ch.ack(message);
};
export const startAuthEventConsumer = async () => {
    if (!env.RABBITMQ_URL) {
        logger.warn('RabbitMQ URL is not configures, skip');
        return;
    }
    if (channel)
        return;
    const connection = (await connect(env.RABBITMQ_URL));
    ConnectionRef = connection;
    const ch = await connection.createChannel();
    channel = ch;
    await ch.assertExchange(AUTH_EVENT_EXCHANGE, 'topic', { durable: true });
    const queue = await ch.assertQueue(QUEUE_NAME, { durable: true });
    await ch.bindQueue(queue.queue, AUTH_EVENT_EXCHANGE, AUTH_USER_REGISTERED_ROUTING_KEY);
    const consumeHandler = (msg) => {
        if (!msg)
            return;
        void handleMessage(msg, ch).catch((error) => {
            logger.error({ error: error }, 'Failed to process auth event');
            ch.nack(msg, false, false);
        });
    };
    const result = await ch.consume(queue.queue, consumeHandler);
    connection.on('close', () => {
        logger.warn('Auth consumer connection closed');
        ConnectionRef = null;
        channel = null;
        consumerTag = null;
    });
    connection.on('error', (error) => {
        logger.error({ error: error }, "Auth connection error");
        ConnectionRef = null;
        channel = null;
        consumerTag = null;
    });
    logger.info('Auth event consumer started');
};
export const stopAuthEventConsume = async () => {
    try {
        const ch = channel;
        if (ch && consumerTag) {
            await ch.cancel(consumerTag);
            consumerTag = null;
        }
        if (ch) {
            await ch.close();
            channel = null;
        }
        const conn = ConnectionRef;
        if (conn) {
            await closeConnection(conn);
            ConnectionRef = null;
        }
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to close auth event consumer');
    }
};
//# sourceMappingURL=auth-consumer.js.map