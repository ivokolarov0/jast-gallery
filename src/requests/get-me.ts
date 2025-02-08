import { Store } from "@tauri-apps/plugin-store";
import { getLocalToken } from "@utils/index";
import { request } from './index';

interface Order {
  "@context": string;
  "@id": string;
  "@type": string;
  customer: string;
  channel: string;
  payments: any[];
  shipments: any[];
  currencyCode: string;
  localeCode: string;
  checkoutState: string;
  paymentState: string;
  shippingState: string;
  tokenValue: string;
  id: number;
  items: any[];
  itemsTotal: number;
  total: number;
  state: string;
  date: string;
  orderPromotionTotal: number;
  taxTotal: number;
  taxExcludedTotal: number;
  taxIncludedTotal: number;
  shippingTotal: number;
  convertedToCurrencyCode: string;
  hasPay: boolean;
  baseTotal: number;
}

const getMe = async (): Promise<[Order | null, null]> => {
  const token = await getLocalToken();

  if (token) {
    const response: [Order | any, any] = await request(`/shop/orders`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"channelCode":"JASTUSA","currency":"USD","localeCode":"en_US"})
    });
    
    if(response[0]?.code === 401) {
      const store = new Store('store.bin');
      await store.delete('account');
      await store.save();
    }
    return response;
  }

  return [null, null];
}

export default getMe;