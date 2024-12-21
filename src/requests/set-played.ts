import { getLocalToken } from "@utils/index";
import { request } from './index';

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