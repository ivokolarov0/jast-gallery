import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { Store } from '@tauri-apps/plugin-store';

const Logout = () => {
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
    <button type="button" className="btn" onClick={handleLogout}>Logout</button>
  )
}

export default Logout