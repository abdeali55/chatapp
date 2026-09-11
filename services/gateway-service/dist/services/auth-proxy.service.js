import { HttpError } from "@chatapp/common";
import axios from 'axios';
import { env } from "@/config/env";
const client = axios.create({
    baseURL: env.AUTH_SERVICE_URL,
    timeout: 5000,
});
const authHeader = {
    headers: {
        'X-Internal-Token': env.INTERNAL_API_TOKEN,
    },
};
const resolvedMessage = (status, data) => {
    if (typeof data === "object" && data && "message" in data) {
        const message = data.message;
        if (typeof message === "string" && message.trim().length > 0) {
            return message;
        }
    }
    return status >= 500 ? "Internal Server Error" : "An error occurred.";
};
const handleAxiosError = (error) => {
    if (!axios.isAxiosError(error) || !error.response) {
        throw new HttpError(500, 'Authentication service is unavailable.');
    }
    const { status, data } = error.response;
    throw new HttpError(status, resolvedMessage(status, data));
};
export const authProxyService = {
    async register(payload) {
        try {
            const response = await client.post('/auth/register', payload, authHeader);
            return response.data;
        }
        catch (error) {
            return handleAxiosError(error);
        }
    }
};
//# sourceMappingURL=auth-proxy.service.js.map