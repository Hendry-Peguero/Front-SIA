// Authentication types

export interface LoginRequest {
    userName: string;
    password: string;
}

export interface LoginResponse {
    userName: string;
    token: string;
}

export interface DecodedToken {
    nameid: string;
    unique_name: string;
    role: string;
    exp: number;
}
