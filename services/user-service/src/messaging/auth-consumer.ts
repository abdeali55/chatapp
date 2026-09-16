import { connect, type Channel, type ChannelModel, type Connection, type ConsumeMessage, type Replies } from "amqplib";

import { AUTH_EVENT_EXCHANGE, AUTH_USER_REGISTERED_ROUTING_KEY, type AuthRegisteredEvent } from "@chatapp/common";

import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { userService } from "@/services/user.service";
import { error, log } from "node:console";


type ManageConnection = Connection & ChannelModel;

let ConnectionRef: ManageConnection | null = null;
let channel: Channel | null = null;
let consumerTag: string | null = null;

const QUEUE_NAME = 'auth-service.auth-event';

const closeConnection = async (conn: ManageConnection) => {
    await conn.close();
    ConnectionRef = null;
    channel = null;
    consumerTag = null;
};

const handleMessage = async (message: ConsumeMessage, ch: Channel) => {
    const raw = message.content.toString('utf-8');
    const event = JSON.parse(raw) as AuthRegisteredEvent;

    await userService.syncFromAuthUser(event.payload);

    ch.ack(message);
}

export const startAuthEventConsumer = async () => {
    if (!env.RABBITMQ_URL) {
        logger.warn('RabbitMQ URL is not configures, skip');
        return;
    }

    if (channel) return;

    const connection = (await connect(env.RABBITMQ_URL)) as ManageConnection;

    ConnectionRef = connection;

    const ch = await connection.createChannel();

    channel = ch;

    await ch.assertExchange(AUTH_EVENT_EXCHANGE, 'topic', {durable: true});

    const queue = await ch.assertQueue(QUEUE_NAME, {durable: true});

    await ch.bindQueue(queue.queue, AUTH_EVENT_EXCHANGE, AUTH_USER_REGISTERED_ROUTING_KEY);

    const consumeHandler = ( msg: ConsumeMessage | null) => {
        if(!msg) return;

        void handleMessage(msg, ch).catch((error: unknown) => {
            logger.error({error: error}, 'Failed to process auth event')
            ch.nack(msg, false, false);
        })
    }

    const result: Replies.Consume = await ch.consume(queue.queue, consumeHandler);

    connection.on('close', () => {
        logger.warn('Auth consumer connection closed');
        ConnectionRef = null;
        channel = null;
        consumerTag = null;
    });

    connection.on('error', (error) => {
        logger.error({error: error}, "Auth connection error");

        ConnectionRef = null;
        channel = null;
        consumerTag = null;
    });

    logger.info('Auth event consumer started');
}

export const stopAuthEventConsume = async () => {
    try {
        const ch = channel;
        if(ch && consumerTag) {
            await ch.cancel(consumerTag);
            consumerTag = null;
        }
        if(ch) {
            await ch.close();
            channel = null;
        }
        const conn = ConnectionRef;
        if (conn) {
            await closeConnection(conn);
            ConnectionRef = null;
        }
    } catch (error) {
        logger.error({err: error}, 'Failed to close auth event consumer');
    }
}