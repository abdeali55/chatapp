import axios from "axios";
import { env } from "../config/env";
import { HttpError } from "@chatapp/common";
const client = axios.create({
    baseURL: env.USER_SERVICE_URL,
    timeout: 5000,
});
const authHeader = {
    headers: {
        'X-Internal-Token': env.INTERNAL_API_TOKEN
    },
};
const resolvedMessage = (status, data) => {
    if (typeof data === "object" && data && "message" in data) {
        const message = data.message;
        if (typeof message === "string" && message.trim().length > 0) {
            return message;
        }
    }
    return status >= 500 ? "User service error" : "An error occurred.";
};
const handleAxiosError = (error) => {
    if (!axios.isAxiosError(error) || !error.response) {
        throw new HttpError(500, 'User service is unavailable.');
    }
    const { status, data } = error.response;
    throw new HttpError(status, resolvedMessage(status, data));
};
export const userProxyService = {
    async getUserById(id) {
        try {
            const response = await client.get(`/users/${id}`, authHeader);
            return response.data;
        }
        catch (error) {
            return handleAxiosError(error);
        }
    },
    async getAllUsers() {
        try {
            const response = await client.get(`/users`, authHeader);
            return response.data;
        }
        catch (error) {
            return handleAxiosError(error);
        }
    },
    async createUser(payload) {
        try {
            const response = await client.post(`/users`, payload, authHeader);
            return response.data;
        }
        catch (error) {
            return handleAxiosError(error);
        }
    },
    async searchUsers(params) {
        try {
            const response = await client.get(`/users/search`, {
                headers: authHeader.headers,
                params: {
                    query: params.query,
                    ...(params.limit ? { limit: params.limit } : {}),
                    ...(params.exclude && params.exclude.length > 0 ? { exclude: params.exclude } : {}),
                }
            });
            return response.data;
        }
        catch (error) {
            return handleAxiosError(error);
        }
    }
};
//# sourceMappingURL=user.proxy.service.js.map