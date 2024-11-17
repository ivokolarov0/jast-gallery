import { fetch } from '@tauri-apps/plugin-http';
import { getLocalToken } from '../utils'

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

export const getPaginatedGames = async (page = "1", search = '') => {
  const searchParams = new URLSearchParams({
    localeCode: "en_US",
    phrase: String(search),
    page: String(page),
    itemsPerPage: "20",
    sort: "product_name_asc"
  }).toString();
  const token = await getLocalToken();

  if (token) {
    const response = await request(`/shop/account/user-games-dev?${searchParams}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
  }

  return [null, null];
}

export const getGame = async (id: string) => {
  const token = await getLocalToken();

  if (token) {
    const response = await request(`/shop/products/${id}`, {
      method: "GET",
      headers: {
        'content-type': "application/json",
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
  }
}

export const getTranslations = async (id: string) => {
  const token = await getLocalToken();

  if (token) {
    return request(`/shop/account/game-translations/${id}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}

export const getDownloadLinks = async (payload: {
  gameId: number,
  gameLinkId: number,
}) => {
  const token = await getLocalToken();

  if (token) {
    return request(`/shop/account/user-games/generate-link`, {
      method: "POST",
      headers: {
        'content-type': "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...payload,
        type:	"default",
        downloaded: false
      })
    })
  }
}

export const markAsPlayed = async (gameId: string | number) => {
  const token = await getLocalToken();

  if (token) {
    return request(`/shop/account/user-game-tags`, {
      method: "POST",
      headers: {
        'content-type': "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        gameId,
        type:	"finished",
      })
    })
  }
}

export const removeAsPlayed = async (gameId: string | number, tagId: number) => {
  const token = await getLocalToken();

  if (token) {
    return request(`/shop/account/user-game-tags/${tagId}`, {
      method: "DELETE",
      headers: {
        'content-type': "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        gameId,
        type:	"finished",
      })
    })
  }
}