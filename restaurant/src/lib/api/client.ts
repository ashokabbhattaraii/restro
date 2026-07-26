import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (response.data.success === true) {
        response.data = response.data.data;
      } else {
        return Promise.reject(new Error(response.data.error || 'Request failed'));
      }
    }
    return response;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
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