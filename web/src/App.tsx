import { useEffect, useState } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  useNavigate,
} from '@tanstack/react-router';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Console from './pages/Console';
import { isDemo } from './demo';

function useTheme() {
  const [dark, setDark] = useState(
    () =>
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches),
  );
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function NavBar() {
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const authed = Boolean(localStorage.getItem('token')) || isDemo;

  const logout = () => {
    localStorage.removeItem('token');
    navigate({ to: '/login' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-onprimary">
            G
          </span>
          <span className="text-base font-bold text-foreground">Game Auto Addon</span>
          {isDemo && (
            <span className="rounded bg-warning/15 px-1.5 py-0.5 text-xs text-warning">演示</span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 text-sm sm:flex">
          <Link
            to="/"
            className="rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-background hover:text-foreground"
          >
            首页
          </Link>
          {authed && (
            <Link
              to="/console"
              className="rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-background hover:text-foreground"
            >
              控制台
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="rounded-md border border-border p-2 text-muted transition-colors hover:text-foreground"
            title="切换亮/暗主题"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          {authed ? (
            <>
              <span className="hidden text-sm text-muted md:inline">
                {isDemo ? 'demo_user' : '已登录'}
              </span>
              <button
                onClick={logout}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
              >
                登录
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-onprimary transition-opacity hover:opacity-90"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
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
