import { fetch } from '@tauri-apps/plugin-http';

export const base = import.meta.env.VITE_JAST_API;

export const request = async <T>(url: string, options: any): Promise<[T | null, any]> => {
  let response: T | null = null;
  let error: any = null;
  try {
    const res = await fetch(`${base}${url}`, options);
    response = await res.json() as T;
  } catch (err) {
    error = err;
  }

  return [response, error];
}
