import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { Store } from '@tauri-apps/plugin-store';
import { useTranslation } from 'react-i18next';

const Logout = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { navigate } = useRouter();
  const store = new Store('store.bin');

  const handleLogout = () => {
    store.delete('account');
    queryClient.resetQueries();
    queryClient.removeQueries();
    navigate({
      to: '/'
    });
  }

  return (
    <button type="button" className="btn" onClick={handleLogout}>{t('header.logout')}</button>
  )
}

export default Logout