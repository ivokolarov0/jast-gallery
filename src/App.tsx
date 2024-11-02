import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import Account from "./components/account";
import { GlobalProvider } from './contexts/global';

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <div className="container">
          <Account />
        </div>
      </GlobalProvider>
    </QueryClientProvider>
  );
}

export default App;
