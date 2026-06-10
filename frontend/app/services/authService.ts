import {LoginRequest, RegisterRequest, LoginResponse, AuthErrorResponse, RegisterResponse, UpdateAvatarRequest, UpdateAvatarResponse} from "../types/auth";


export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const res = await fetch(`${process.env.BACKEND_API}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error: AuthErrorResponse = await res.json();
    throw error;
  }
  return res.json();
}


export async function login (data:LoginRequest): Promise<LoginResponse> {
    const res = await fetch (`${process.env.BACKEND_API}/login/`, {
        method:"POST",
        headers: { 'Content-Type': "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error: AuthErrorResponse = await res.json();
        throw error;
    }

return res.json();
}


export async function updateAvatar (data:UpdateAvatarRequest): Promise<UpdateAvatarResponse> {
  const formData = new FormData();
  formData.append("avatar", data.avatar);

  const res = await fetch (`${process.env.BACKEND_API}/profile/avatar`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error: AuthErrorResponse = await res.json();
    throw error;
  }

  return res.json();
}

