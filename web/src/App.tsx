import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  useNavigate,
} from '@tanstack/react-router';

import Home from './pages/Home';
import { isDemo } from './demo';
import Login from './pages/Login';
import Register from './pages/Register';
import Console from './pages/Console';

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || (isDemo ? 'demo' : null);

  const logout = () => {
    localStorage.removeItem('token');
    navigate({ to: '/login' });
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold text-white">
          Game Auto Addon
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          {token ? (
            <>
              <Link to="/console" className="hover:text-white">
                控制台
              </Link>
              <button onClick={logout} className="hover:text-white">
                退出登录
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-white">
                登录
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500"
              >
                注册
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <Outlet />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
});

const consoleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/console',
  component: Console,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  consoleRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
