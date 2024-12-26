import { Store } from '@tauri-apps/plugin-store';

export const getLocalToken = async () => {
  const store = new Store('store.bin');
  const account = await store.get<{ token?: string }>('account');
  return account?.token;
}

export const excludeTypes = [
  'PRODUCT_MINIATURE',
  'TAIL_PACKAGE_THUMBNAIL_PRODUCT',
  'TALL_SEARCH_CATALOG',
]

export const jastMedia = import.meta.env.VITE_JAST_MEDIA

export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: any;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
