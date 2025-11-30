// Authentication types

export interface LoginRequest {
    userName: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    userName: string;
}

export interface DecodedToken {
    nameid: string;
    unique_name: string;
    role: string;
    exp: number;
}
