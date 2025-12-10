import { apiFetch } from './apiFetch';

export type AuthResult = { success: true } | { success: false; status: number };

export async function logIn(
  email: string,
  password: string
): Promise<AuthResult> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { success: false, status: res.status };
  } else {
    return { success: true };
  }
}

export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    return { success: false, status: res.status };
  } else {
    return { success: true };
  }
}

export async function logOut(): Promise<AuthResult> {
  const res = await apiFetch('/api/auth/logout', {
    method: 'POST',
  });

  if (!res.ok) {
    return { success: false, status: res.status };
  } else {
    return { success: true };
  }
}
