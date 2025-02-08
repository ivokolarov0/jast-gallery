import throttle from "lodash/throttle";
import { toast } from "react-toastify";

import { getLocalToken } from "@utils/index";
import { request } from './index';


interface GameLinkTranslation {
  "@id": string;
  "@type": string;
  id: number;
  locale: string;
}

interface Game {
  "@id": string;
  "@type": string;
  translations: {
      en_US: GameLinkTranslation;
  };
}

interface ProductVariant {
  "@id": string;
  "@type": string;
  game: Game;
  productName: string;
  productVariantName: string | null;
  productImage: string;
  productImageBackground: string | null;
  platforms: Array<{ en_US: string }>;
  productCode: string;
  gameId: number;
  userGameTags: any[];
  hasPatches_en_US: boolean;
  hasPatches_zh_Hans: boolean;
  hasPatches_zh_Hant: boolean;
}

interface Product {
  "@id": string;
  "@type": string;
  variants: ProductVariant[];
  variant: ProductVariant;
}

interface Result {
  "@context": string;
  "@id": string;
  "@type": string;
  products: Product[];
  total: number;
  pages: number;
  code?: number;
  messages?: string;
}

const getMyGames = throttle(async (page = "1", search = '', itemsPerPage = 100, token = null): Promise<[Result | null, null]> => {
  const currentPage = parseInt(page);
  const searchParams = new URLSearchParams({
    localeCode: "en_US",
    phrase: String(search),
    page: String(page),
    itemsPerPage: itemsPerPage,
    sort: "product_name_asc"
  }).toString();
  token = token ?? await getLocalToken();

  if (token) {
    const response: [Result | any, any] = await request(`/shop/account/user-games?${searchParams}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if(response[0].pages > 1 && currentPage < response[0].pages) {
      const nextPage = parseInt(page) + 1;
      const newReponse = await getMyGames(nextPage, search, itemsPerPage, token);
      if(newReponse[0]) {
        response[0].products = [...response[0].products, ...newReponse[0].products];
      }
    }

    toast(
      "Fetching completed ", 
      { 
        type: "success", 
        autoClose: 1500, 
        position: "bottom-right" 
      }
    )

    return response;
  }

  return [null, null];
}, 3000);

export type { Game, Product, ProductVariant, Result };
export default getMyGames;