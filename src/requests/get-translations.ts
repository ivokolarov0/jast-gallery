import { getLocalToken } from "@utils/index";
import { request } from './index';

interface GameLink {
  "@type": string;
  gameId: number;
  gameLinkId: number;
  label: string;
  platforms: string[];
  version: string | null;
}

interface GameLinksResponse {
  "@context": string;
  "@id": string;
  "@type": string;
  gamePathLinks: GameLink[];
  gameExtraLinks: any[];
  gamePatchLinks: any[];
}

const getTranslations = async (id: string | number | undefined): Promise<[GameLinksResponse | null, null]> => {
  const token = await getLocalToken();

  if(!id) {
    return [null, null]
  }

  if (token) {
    return request(`/shop/account/game-translations/${id}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  return [null, null]
}

export type { GameLink, GameLinksResponse }
export default getTranslations;