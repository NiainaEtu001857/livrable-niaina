import axios from "axios";
import { API_URL } from "../Api";


interface RegisterRequest {
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
    };
}

export const register = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await axios.post<AuthResponse>(`${API_URL}/register`, {
        email,
        password,
    } as RegisterRequest);

    return res.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(`${API_URL}/login`, {
    email,
    password,
  });

  return res.data;
};