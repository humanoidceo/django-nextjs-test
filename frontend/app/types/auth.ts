export interface RegisterRequest {
    username:string;
    first_name:string;
    password:string;
    confirm_password:string;
    role:string;
}

export interface RegisterResponse {
    id: number;
    username: string;
    email: string;
    first_name: string;
    
}


export interface LoginRequest{
    email:string;
    password:string;
}


export interface LoginResponse {
  message: string;
}

export interface AuthErrorResponse {
    error: string;
}

export interface UpdateAvatarRequest {
    avatar: File;
}

export interface UpdateAvatarResponse {
    avatar: string;
}

