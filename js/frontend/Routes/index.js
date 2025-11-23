import { useRoutes } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
// project import
import LoginRoutes from './LoginRoutes.js';
import MainRoutes from './MainRoutes.js';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const mainRoutes = MainRoutes();
  const { isAuthenticated } = useAuth();
  const routes = isAuthenticated ? mainRoutes : LoginRoutes;

  return useRoutes([routes]);
}
