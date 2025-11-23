// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from 'context/AuthContext';
import { UserProvider } from 'context/UserContext';
import VerifyTK from 'controller/VerifyTk';
import SocketProvider from 'context/SocketContext';
import './App.css';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //
const queryClient = new QueryClient();

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <AuthProvider>
            <VerifyTK>
              <SocketProvider>
                  <Routes />
              </SocketProvider>
            </VerifyTK>
          </AuthProvider>
        </UserProvider>
      </QueryClientProvider>
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
