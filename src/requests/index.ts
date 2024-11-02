import { fetch } from '@tauri-apps/plugin-http';
import { Store } from '@tauri-apps/plugin-store';

export const base = import.meta.env.VITE_JAST_API;

type LoginValuesType = {
  email: string,
  password: string,
  remember_me: number
}


const request = async (url: string, options: any) => {
  let response = null;
  let error = null;
  try {
    response = await fetch(`${base}${url}`, options);
    response = await response.json();
  } catch (error) {
    error = error;
  }

  return [response, error];
}

export const login = (body: LoginValuesType) => request('/shop/authentication-token', {
  method: "POST",
  headers: {
    'content-type': "application/json"
  },
  body: JSON.stringify(body)
})

export const getPaginatedGames = async (page = 1, search = '') => {
  const searchParams = new URLSearchParams({
    localeCode: "en_US",
    phrase: String(search),
    page: String(page),
    itemsPerPage: "20",
    sort: "product_name_asc"
  }).toString();
  const store = new Store('store.bin');
  const account = await store.get<{ token?: string }>('account');

  if (account?.token) {
    return request(`/shop/account/user-games-dev?${searchParams}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${account?.token}`
      }
    })
  }
}