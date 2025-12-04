import { redirect } from 'next/navigation';

export async function apiFetch<T>(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 401) {
    redirect('/login');
  }

  return res;
}
