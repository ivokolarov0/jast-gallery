import { getLocalToken } from "@utils/index";
import { request } from './index';

type TypeProp = {
  gameId: string | number,
  type: 'finished' | 'love_it' | 'next_to_play' | 'recommended'
}

export const setGameTag = async (gameId: TypeProp['gameId'], type: TypeProp['type']) => {
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
        type:	type,
      })
    })
  }

  return [null, null]
}

export const removeGameTag = async (gameId: string | number, tagId: number) => {
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
      })
    })
  }

  return [null, null]
}