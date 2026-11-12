import type { UserCreatedPayload } from "@chatapp/common";
export declare const initMessaging: () => Promise<void>;
export declare const closeMessaging: () => Promise<void>;
export declare const publishUserCreated: (payload: UserCreatedPayload) => Promise<void>;
export declare const sendUserCreated: (payload: UserCreatedPayload) => Promise<void>;
//# sourceMappingURL=event-publisher.d.ts.map