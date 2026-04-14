export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    username: string;
    role: string;
    token: string;
}

export interface User {
    username: string;
    role: string;
}

export interface PostResetPasswordRequest {
    email: string;
}

export interface PostResetPasswordVerifyRequest {
    token: string;
    password: string;
}