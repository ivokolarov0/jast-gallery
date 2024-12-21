import { useQueryClient } from '@tanstack/react-query';
import { Store } from '@tauri-apps/plugin-store';

const Logout = () => {
  const queryClient = useQueryClient()
  const store = new Store('store.bin');

  const handleLogout = () => {
    store.delete('account');
    queryClient.resetQueries();
    queryClient.removeQueries();
  }

  return (
    <button type="button" onClick={handleLogout}>Logout</button>
  )
}

export default Logout