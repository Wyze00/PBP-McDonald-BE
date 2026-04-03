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