import { USER_CREATED_ROUTING_KEY, USER_EVENT_EXCHANGE } from "@chatapp/common";
import amqplib from 'amqplib';
import { env } from "@/config/env";
import { logger } from "@/utils/logger";
let connection = null;
let channel = null;
const messagingEnabled = Boolean(env.RABBITMQ_URL);
const ensureChannel = async () => {
    if (!messagingEnabled)
        return null;
    if (channel)
        return channel;
    if (!env.RABBITMQ_URL)
        return null;
    const amqpConnection = (await amqplib.connect(env.RABBITMQ_URL));
    connection = amqpConnection;
    amqpConnection.on('close', () => {
        logger.warn('RabbitMQ connection closed');
        connection = null;
        channel = null;
    });
    amqpConnection.on('error', (error) => {
        logger.error({ error }, 'RabbitMQ connection error');
    });
    const amqpChannel = await amqpConnection.createChannel();
    channel = amqpChannel;
    await amqpChannel.assertExchange(USER_EVENT_EXCHANGE, 'topic', { durable: true });
    return amqpChannel;
};
export const initMessaging = async () => {
    if (!messagingEnabled) {
        logger.warn("RabbitMQ is disabled");
        return;
    }
    if (!env.RABBITMQ_URL) {
        logger.warn('RABBITMQ_URL is not defined. Skipping RabbitMQ initialization');
        return;
    }
    try {
        await ensureChannel();
        logger.info('User service RabbitMQ publisher initialized');
    }
    catch (error) {
        logger.error({ error }, 'Failed to initialize RabbitMQ publisher');
    }
};
export const closeMessaging = async () => {
    try {
        const currentChannel = channel;
        if (currentChannel) {
            await currentChannel.close();
            channel = null;
        }
        const currentConnection = connection;
        if (currentConnection) {
            await currentConnection.close();
            connection = null;
        }
        logger.info('User service RabbitMQ publisher closed');
    }
    catch (error) {
        logger.error({ error }, 'Failed to close RabbitMQ publisher');
    }
};
export const publishUserCreated = async (payload) => {
    const ch = await ensureChannel();
    if (!ch) {
        logger.debug('Skipping user.created event publish; messaging disabled');
        return;
    }
    try {
        const event = {
            type: USER_CREATED_ROUTING_KEY,
            payload,
            occurredAt: new Date().toISOString(),
            metadata: { version: 1 },
        };
        const published = ch.publish(USER_EVENT_EXCHANGE, USER_CREATED_ROUTING_KEY, Buffer.from(JSON.stringify(event)), { contentType: 'application/json', persistent: true });
        if (!published) {
            logger.warn({ event }, 'Failed to publish user created event');
        }
        else {
            logger.info({ event }, 'User created event published');
        }
    }
    catch (error) {
        logger.error({ error, payload }, 'Failed to publish user created event');
    }
};
export const sendUserCreated = async (payload) => {
    try {
        await ensureChannel();
        await publishUserCreated(payload);
    }
    catch (error) {
        logger.error({ error, payload }, 'Error sending user created event');
    }
};
//# sourceMappingURL=event-publisher.js.map