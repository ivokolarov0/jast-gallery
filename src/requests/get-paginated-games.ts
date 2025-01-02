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

const getPaginatedGames = async ({
  page = "1",
  search = '',
  attributes = '',
  taxons = '',
  userGameTags = ''
}): Promise<[Result | null, null]> => {
  const searchParams = new URLSearchParams({
    localeCode: "en_US",
    phrase: String(search),
    page: String(page),
    itemsPerPage: "20",
    sort: "product_name_asc"
  });
  const token = await getLocalToken();
  const argumentTypes = {
    attributes,
    taxons,
    userGameTags
  }

  const handleArguments = (type: string) => {
    const argument = argumentTypes[type as keyof typeof argumentTypes];
    if(argument !== '') {
      const items = argument.split(',');
      items.forEach((item) => {
        searchParams.append(`${type}[]`, item);
      });
    }
  }

  handleArguments('attributes');
  handleArguments('taxons');
  handleArguments('userGameTags');

  const finalSearchURL = searchParams.toString();

  if (token) {
    const response: [Result | any, any] = await request(`/shop/account/user-games-dev?${finalSearchURL}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
  }

  return [null, null];
}

export type { Game, Product, ProductVariant, Result };
export default getPaginatedGames;