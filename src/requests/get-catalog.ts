import { getLocalToken } from "@utils/index";
import { request } from ".";

type CatalogType = {
  catalog: 'new-titles_en_US' | 'hot-this-week_en_US'
}

interface Product {
  productESRB: ESRB | null;
  images: Image[];
  id: number;
  code: string;
  attributes: Record<string, Attribute>;
  variants: Variant[];
  translations: Record<string, Translation>;
  defaultVariant: string;
  bonusPoints: BonusPoints;
}

interface ESRB {
  ESRBRating: string | null;
  ESRBContent: string | null;
  matureContent: boolean;
}

interface Image {
  priority: number | null;
  matureContent: boolean;
  type: string;
  path: string;
}

interface Attribute {
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

interface Variant {
  price: number;
  originalPrice: number;
  isFree: boolean;
  id: number;
  code: string;
  translations: Record<string, Translation>;
  discount: number;
  inStock: boolean;
}

interface Translation {
  name: string | null;
  locale: string;
  shortDescription?: string;
  description?: string;
}

interface BonusPoints {
  value: number;
  amount: number;
  currencyCode: string;
}

interface Catalog {
  products: Product[];
  attributes: AttributeGroup[];
  total: number;
  pages: number;
  catalogName: string;
}

interface AttributeGroup {
  name: string;
  values: AttributeValue[];
  code: string;
  position: number;
}

interface AttributeValue {
  label: string;
  code: string;
  counter: number;
}

type RegionalPriceZone = {
  "@context": string;
  "@id": string;
  "@type": string;
  zone: string;
}

const getCatalog = async (catalog: CatalogType['catalog'], limit: string = '10'): Promise<[Catalog | any, any]> => {
  const token = await getLocalToken();

  let headers = new Headers({
    'content-type': "application/json",
  });

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const [ data ]: [ data: RegionalPriceZone | null, error: any] = await request(`/shop/regional-zone`, {
    method: "GET",
    headers: headers,
  });

  const params = new URLSearchParams();
  params.append('catalogCode', catalog);
  params.append('channelCode', 'JASTUSA');
  params.append('currency', 'USD');
  params.append('limit', limit);
  params.append('localeCode', 'en_US');
  params.append('page', '1');
  params.append('zone', data?.zone || 'USA');

  return request(`/shop/es?${params.toString()}`, {
    method: "GET",
    headers: headers,
  });
}

export type { Catalog, Product, Image, Variant }
export default getCatalog;