import { getLocalToken } from "@utils/index";
import { request } from './index';

interface ProductContext {
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
  id: number;
  type: string;
  path: string;
}

interface ProductAttributeValueConfiguration {
  choices: Record<string, Record<string, string>>;
  multiple: boolean;
  min: number;
  max: number;
}

interface ProductAttributeValue {
  "@type": string;
  id: number;
  localeCode: string;
  type: string;
  code: string;
  value: string[];
  attribute_id: number;
  configuration: ProductAttributeValueConfiguration;
}

interface ChannelPricing {
  "@type": string;
  channelCode: string;
  price: number;
  originalPrice: number | null;
}

interface ProductVariantTranslation {
  "@id": string;
  "@type": string;
  id: number;
  name: string | null;
  locale: string;
}

interface ProductVariant {
  "@id": string;
  "@type": string;
  game: string;
  channelPricings: Record<string, ChannelPricing>;
  id: number;
  translations: Record<string, ProductVariantTranslation>;
  price: number;
  originalPrice: number;
  discount: number;
  isFree: boolean;
  inStock: boolean;
}

interface ProductTranslation {
  "@id": string;
  "@type": string;
  shortDescription: string;
  id: number;
  name: string;
  slug: string;
  description: string;
  metaKeywords: string | null;
  metaDescription: string | null;
}

interface Product {
  "@context": string;
  "@id": string;
  "@type": string;
  productESRB: ProductContext;
  sku: string;
  releaseDate: string;
  originalReleaseDate: string;
  productTaxons: string[];
  mainTaxon: string;
  reviews: any[];
  averageRating: number;
  images: ProductImage[];
  id: number;
  code: string;
  attributes: ProductAttributeValue[];
  variants: ProductVariant[];
  options: any[];
  associations: any[];
  createdAt: string;
  updatedAt: string;
  translations: Record<string, ProductTranslation>;
  shortDescription: string;
  name: string;
  description: string;
  slug: string;
  defaultVariant: string;
  bonusPoints: {
    value: number;
    amount: number;
    currencyCode: string;
  };
}

const getGame = async (id: string): Promise<[Product | null, null]> => {
  const token = await getLocalToken();

  if (token) {
    const response: [Product | any, any] = await request(`/shop/products/${id}`, {
      method: "GET",
      headers: {
        'content-type': "application/json",
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
  }

  return [null, null];
}

export type { 
  Product,
  ProductVariant,
  ProductAttributeValue,
  ProductAttributeValueConfiguration,
  ProductContext,
  ProductImage,
  ProductTranslation,
  ProductVariantTranslation,
  ChannelPricing 
};
export default getGame;