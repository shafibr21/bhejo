import { RegisterPayload } from "@/types/user";

const API_URL = '/api/auth';

export async function register(user: RegisterPayload) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: { 'Content-Type': 'application/json' },
  });
  return await res.json();
}

export async function login(credentials: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export function logout() {
  localStorage.removeItem('token');
}
