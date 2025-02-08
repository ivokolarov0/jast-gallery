import { throttle } from "lodash";
import { request } from ".";

interface ShopResponse {
  "@context": string;
  "@type": string;
  products: Product[];
  total: number;
  pages: number;
}

interface Product {
	"@id": string;
	"@type": string;
	productESRB: ProductESRB;
	images: ProductImage[];
	id: number;
	code: string;
	attributes: Record<string, ProductAttributeValue>;
	variants: ProductVariant[];
	translations: Record<string, ProductTranslation>;
	defaultVariant: string;
	bonusPoints: BonusPoints;
}

interface ProductESRB {
	"@type": string;
	ESRBRating: string | null;
	ESRBContent: string | null;
	matureContent: boolean;
}

interface ProductImage {
	"@id": string;
	"@type": string;
	priority: number;
	matureContent: boolean;
	type: string;
	path: string;
}

interface ProductAttributeValue {
	"@type": string;
	localeCode: string;
	code: string;
	value: string[];
	configuration: Configuration;
}

interface Configuration {
	choices: Record<string, Choice>;
	multiple: boolean;
	min: number;
	max: number;
}

interface Choice {
	en_US: string;
}

interface ProductVariant {
	"@id": string;
	"@type": string;
	price: number;
	originalPrice: number;
	isFree: boolean;
	id: number;
	code: string;
	translations: Record<string, ProductVariantTranslation>;
	discount: number;
	inStock: boolean;
}

interface ProductVariantTranslation {
	"@id": string;
	"@type": string;
	name: string | null;
	locale: string;
}

interface ProductTranslation {
	"@id": string;
	"@type": string;
	shortDescription: string;
	name: string;
	description: string;
	locale: string;
}

interface BonusPoints {
	value: number;
	amount: number;
	currencyCode: string;
}

const getAllGames = throttle(async (page = 1, items = []): Promise<Product[] | null>  => {
  const [response, error]: [ShopResponse | null, any] = await request(`/shop/es?channelCode=JASTUSA&currency=USD&limit=24&localeCode=en_US&page=${page}&priceMax=0&priceMin=0&sale=false&sort=newest`, {
    method: "GET",
  });

  if(error) {
    return null;
  }

  if (response) {
    items = items.concat(response.products);
    if (response.pages > page) {
      return await getAllGames((page + 1), items);
    }
    return items;
  }
  

  return []
}, 1000);

export default getAllGames;