export interface UserDto {
    id: string;
    email: string;
    displayName?: string;
    createdAt: string;
    updatedAt: string;
}
export interface UserResponse {
    data: UserDto;
}
export interface UserLisResponse {
    data: UserDto[];
}
export interface CreateUserPayload {
    email: string;
    displayName: string;
}
export interface SearchUserParams {
    query: string;
    limit: number;
    exclude?: string[];
}
export declare const userProxyService: {
    getUserById(id: string): Promise<UserResponse>;
    getAllUsers(): Promise<UserLisResponse>;
    createUser(payload: CreateUserPayload): Promise<UserResponse>;
    searchUsers(params: SearchUserParams): Promise<UserLisResponse>;
};
//# sourceMappingURL=user.proxy.service.d.ts.map