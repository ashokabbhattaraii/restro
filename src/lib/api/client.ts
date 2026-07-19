import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export async function fetcher<T>(url: string): Promise<T> {
  const { data } = await api.get<T>(url);
  return data;
}

export async function poster<T>(url: string, body: unknown): Promise<T> {
  const { data } = await api.post<T>(url, body);
  return data;
}

export async function putter<T>(url: string, body: unknown): Promise<T> {
  const { data } = await api.put<T>(url, body);
  return data;
}

export async function deleter<T>(url: string): Promise<T> {
  const { data } = await api.delete<T>(url);
  return data;
}