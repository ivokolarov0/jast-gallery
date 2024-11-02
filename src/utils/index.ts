import { Store } from '@tauri-apps/plugin-store';

export const getLocalToken = async () => {
  const store = new Store('store.bin');
  const account = await store.get<{ token?: string }>('account');
  return account?.token;
}