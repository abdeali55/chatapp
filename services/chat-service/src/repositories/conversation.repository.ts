import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import type { WithId, Document } from "mongodb";

import type {
    Conversation,
    ConversationFilter,
    ConversationSummary,
    CreateConversationInput,
} from '@/types/conversation';

import { getMongoClient } from "@/clients/mongo.client";
import { title } from "node:process";

const CONVERSATIONS_COLLECTION = 'conversations';
const MESSAGE_COLLECTION = 'messages';

const toConversation = (doc: WithId<Document>):Conversation => ({
    id: String(doc._id),
    title: typeof doc.title === 'string' ? doc.title: null,
    participantIds: Array.isArray(doc.participantIds) ? (doc.participantIds as string[]) : [],
    createdAt: new Date(doc.createdAt as string | number | Date),
    updatedAt: new Date(doc.updatedAt as string | number | Date),
    lastMessageAt: doc.lastMessageAt ? new Date(doc.lastMessageAt as string | number | Date): null,
    lastMessagePreview: typeof doc.lastMessagePreview === 'string' ? doc.lastMessagePreview : null,
});

const toConversationSummary = (doc: WithId<Document>): ConversationSummary => toConversation(doc);

export const conversationRepository = {
    async create(input: CreateConversationInput): Promise<Conversation> {
        const client = await getMongoClient();
        const db = client.db();
        const collection = db.collection(CONVERSATIONS_COLLECTION);
        const now = new Date();
        const document = {
            _id: randomUUID(),
            title: input.title ?? null,
            participantIds: input.participantIds,
            createdAt: now,
            updatedAt: now,
            lastMessage: null,
            lastMessagePreview: null, 
        };
        await collection.insertOne(document as unknown as Document);
        return toConversation(document as unknown as WithId<Document>);
    },

    async findById(id: string): Promise<Conversation | null> {
        const client = await getMongoClient();
        const db = client.db();
        const doc = await db.collection(CONVERSATIONS_COLLECTION).findOne({ _id: new ObjectId(id) });
        return doc ? toConversation(doc) : null;
    } ,

    async findSummaries(filter: ConversationFilter): Promise<ConversationSummary[]> {
        const client = await getMongoClient();
        const db = client.db();
        const cursor = db
            .collection(CONVERSATIONS_COLLECTION)
            .find({ participantIds: filter.participantIds})
            .sort({ lastMessageAt: -1, updatedAt: -1});
        const result = await cursor.toArray();
        return result.map((doc) => toConversationSummary(doc));
    },
    async touchConversation(conversationId: string, preview: string): Promise<void> {
        const client = await getMongoClient();
        const db = client.db();
        await db.collection(CONVERSATIONS_COLLECTION).updateOne(
            { _id: new ObjectId(conversationId) },
        {
            $set: {
                lastMessageAt: new Date(),
                lastMessagePreview: preview,
                updatedAt: new Date(),
            }
        })
    },

    async removeAll(): Promise<void>{
        const client = await getMongoClient();
        const db = client.db();
        await Promise.all([
            db.collection(CONVERSATIONS_COLLECTION).deleteMany({}),
            db.collection(MESSAGE_COLLECTION).deleteMany({}),
        ])
    }


};

