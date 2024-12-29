import { getLocalToken } from "@utils/index";
import { request } from './index';

// type TypeProp = {
//   type: 'finished' | 'love_it' | 'next_to_play' | 'recommended'
// }

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

  return [null, null]
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

  return [null, null]
}