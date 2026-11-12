import { connect,type Channel, type ChannelModel, type ConsumeMessage, type Replies } from "amqplib";

import {
    USER_CREATED_ROUTING_KEY,
    USER_EVENT_EXCHANGE,
    type UserCreatedEvent,
} from "@chatapp/common"
import { userRepository } from "@/repositories/user.repository";
import { logger } from "@/utils/logger";
import { env } from "@/config/env";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;
let consumerTag:  string | null = null;

const EVENT_QUEUE = 'chat-service.user-events';

const closeAmpqConnection = async (conn: ChannelModel) => {
    await conn.close();
}

const handleUserCreated = async (event: UserCreatedEvent) => {
    await userRepository.upsertUser(event.payload);
};

export const startConsumers = async () => {
    if (!env.RABBITMQ_URL) {
        logger.info('RabbitMQ URL not configured; consumer disabled');
        return;
    };

    const conn = await connect(env.RABBITMQ_URL);
    connection = conn;
    const ch = await conn.createChannel();
    channel = ch;

    await ch.assertExchange(USER_EVENT_EXCHANGE, 'topic', { durable: true });
    const queue = await ch.assertQueue(EVENT_QUEUE, { durable: true });
    await ch.bindQueue(queue.queue, USER_EVENT_EXCHANGE, USER_CREATED_ROUTING_KEY);

    const consumerHandler = (message: ConsumeMessage | null) => {
        if (!message) return;

        void (async () => {
            const payload = message.content.toString('utf-8');
            const event = JSON.parse(payload) as UserCreatedEvent;
            await handleUserCreated(event);
            ch.ack(message);
        })().catch((error: unknown) => {
            logger.error({ err: error }, 'Failed to process event');
            ch.nack(message, false, false);
        });
    };

    const result: Replies.Consume = await ch.consume(queue.queue, consumerHandler);
    consumerTag = result.consumerTag;
};

export const stopConsumers = async () => {
    try {
        const ch = channel;
        if (ch && consumerTag) {
            await ch.cancel(consumerTag);
            consumerTag = null;
        }
        if(ch) {
            await ch.close;
            channel = null;
        }
        const conn = connection; 
        if(conn) {
            await closeAmpqConnection(conn);
            connection = null;
        }
    } catch (error) {
        logger.error({ err: error}, 'Error stopping RabbitMQ consumer')
    }
}