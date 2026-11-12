import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Navigate,
  Outlet,
} from '@tanstack/react-router';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import {
  ConsoleLayout,
  OverviewPage,
  OrdersPage,
  TokensPage,
  SettingsPage,
} from './pages/console';
import { ThemeToggle } from './components/theme';
import { isDemo } from './demo';

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-onprimary">
        G
      </span>
      <span className="text-base font-bold text-foreground">Game Auto Addon</span>
      {isDemo && (
        <span className="rounded bg-warning/15 px-1.5 py-0.5 text-xs text-warning">演示</span>
      )}
    </Link>
  );
}

function authed(): boolean {
  return Boolean(localStorage.getItem('token')) || isDemo;
}

/* ---------------- 公共布局（Launch UI 风格顶栏） ---------------- */

function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              首页
            </Link>
            <Link
              to="/"
              hash="features"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              功能
            </Link>
            {authed() && (
              <Link
                to="/console/overview"
                className="rounded-md px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                控制台
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {authed() ? (
              <>
                <span className="hidden text-sm text-muted lg:inline">
                  {isDemo ? 'demo_user' : '已登录'}
                </span>
                <Link
                  to="/console/overview"
                  className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-onprimary transition-opacity hover:opacity-90"
                >
                  控制台
                </Link>
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
                  开始使用
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

/* ---------------- 路由 ---------------- */

const rootRoute = createRootRoute();

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: PublicLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: Home,
});

const loginRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/login',
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/register',
  component: Register,
});

const consoleLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'console-layout',
  component: ConsoleLayout,
});

const consoleIndexRoute = createRoute({
  getParentRoute: () => consoleLayoutRoute,
  path: '/console',
  component: () => <Navigate to="/console/overview" replace />,
});

const consoleOverviewRoute = createRoute({
  getParentRoute: () => consoleLayoutRoute,
  path: '/console/overview',
  component: OverviewPage,
});

const consoleOrdersRoute = createRoute({
  getParentRoute: () => consoleLayoutRoute,
  path: '/console/orders',
  component: OrdersPage,
});

const consoleTokensRoute = createRoute({
  getParentRoute: () => consoleLayoutRoute,
  path: '/console/tokens',
  component: TokensPage,
});

const consoleSettingsRoute = createRoute({
  getParentRoute: () => consoleLayoutRoute,
  path: '/console/settings',
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([homeRoute, loginRoute, registerRoute]),
  consoleLayoutRoute.addChildren([
    consoleIndexRoute,
    consoleOverviewRoute,
    consoleOrdersRoute,
    consoleTokensRoute,
    consoleSettingsRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
