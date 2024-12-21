import { getLocalToken } from "@utils/index";
import { request } from ".";

type Payload = {
  gameId: number,
  gameLinkId: number,
}

type Response = {
  url: string
}

const getDownloadLinks = async (payload: Payload): Promise<[Response | any, any]> => {
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

  return [null, null];
}

export default getDownloadLinks;