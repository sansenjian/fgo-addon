// 控制台：newapi 风格侧边栏 + 顶部条布局
import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard,
  ClipboardList,
  KeyRound,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Copy,
  Check,
  Home,
} from 'lucide-react';

import { api } from '../api/client';
import { ThemeToggle } from '../components/theme';
import { isDemo, demoUser, demoTokens, demoOrders } from '../demo';

/* ---------------- 布局 ---------------- */

const menuGroups = [
  {
    label: '工作台',
    items: [
      { to: '/console/overview', label: '概览', icon: LayoutDashboard },
      { to: '/console/orders', label: '代肝订单', icon: ClipboardList },
    ],
  },
  {
    label: '开发者',
    items: [{ to: '/console/tokens', label: 'API 令牌', icon: KeyRound }],
  },
  {
    label: '账户',
    items: [{ to: '/console/settings', label: '个人设置', icon: Settings }],
  },
];

const crumbs: Record<string, [string, string]> = {
  '/console/overview': ['工作台', '概览'],
  '/console/orders': ['工作台', '代肝订单'],
  '/console/tokens': ['开发者', 'API 令牌'],
  '/console/settings': ['账户', '个人设置'],
};

function SidebarNavItem({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-accent hover:text-accent-foreground"
      activeProps={{
        className:
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-accent text-accent-foreground',
      }}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}

function UserMenu({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-2 text-sm transition-colors hover:bg-accent"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
          {username.slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden sm:inline">{username}</span>
        <ChevronDown size={14} className="text-muted" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-border bg-card p-1 shadow-lg">
            <Link
              to="/console/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent"
            >
              <Settings size={14} /> 个人设置
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate({ to: '/login' });
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-accent"
            >
              <LogOut size={14} /> 退出登录
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function ConsoleLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const ok = isDemo || Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (!ok) navigate({ to: '/login' });
  }, [ok, navigate]);

  if (!ok) return null;

  const username = isDemo ? demoUser.username : '我的账户';
  const [group, page] = crumbs[pathname] ?? ['工作台', ''];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-surface">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-onprimary">
              G
            </span>
            <span className="text-sm font-bold">Game Auto Addon</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto p-3">
          {menuGroups.map((g) => (
            <div key={g.label}>
              <div className="mb-1 px-3 text-xs font-medium text-muted">{g.label}</div>
              <div className="space-y-0.5">
                {g.items.map((it) => (
                  <SidebarNavItem key={it.to} {...it} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center justify-between px-2">
            <Link to="/" className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground">
              <Home size={12} /> 返回首页
            </Link>
            {isDemo && (
              <span className="rounded bg-warning/15 px-1.5 py-0.5 text-xs text-warning">演示</span>
            )}
          </div>
        </div>
      </aside>

      <div className="ml-60">
        {/* 顶部条：面包屑 + 主题 + 用户 */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/80 px-6 backdrop-blur">
          <nav className="flex items-center gap-1.5 text-sm text-muted">
            <span>{group}</span>
            <ChevronRight size={14} />
            <span className="font-medium text-foreground">{page}</span>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu username={username} />
          </div>
        </header>

        <main className="mx-auto max-w-5xl p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ---------------- 数据 hook ---------------- */

interface UserInfo {
  id: number;
  username: string;
  display_name: string;
  role: number;
  created_time: number;
}

interface Token {
  id: number;
  key: string;
  name: string;
  status: number;
  created_time: number;
  expired_time: number;
  remain_quota: number;
  used_quota: number;
  unlimited_quota: boolean;
}

function useUser(): UserInfo | null {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(isDemo ? demoUser : null);
  useEffect(() => {
    if (isDemo) return;
    if (!localStorage.getItem('token')) {
      navigate({ to: '/login' });
      return;
    }
    api
      .get('/user/self')
      .then((res) => res.data.success && setUser(res.data.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate({ to: '/login' });
        }
      });
  }, [navigate]);
  return user;
}

function useTokens(): [Token[], () => void] {
  const [tokens, setTokens] = useState<Token[]>(isDemo ? demoTokens : []);
  const reload = () => {
    if (isDemo) return;
    api
      .get('/token')
      .then((res) => res.data.success && setTokens(res.data.data))
      .catch(() => {});
  };
  useEffect(reload, []);
  return [tokens, reload];
}

const fmtTime = (ts: number) => (ts > 0 ? new Date(ts * 1000).toLocaleString() : '永不过期');
const roleName = (r: number) => (r === 100 ? '超级管理员' : r === 10 ? '管理员' : '用户');

function Badge({ tone, children }: { tone: 'success' | 'muted' | 'primary'; children: React.ReactNode }) {
  const cls = {
    success: 'bg-success/10 text-success',
    muted: 'bg-accent text-muted',
    primary: 'bg-primary/10 text-primary',
  }[tone];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        } catch {
          /* 忽略剪贴板权限错误 */
        }
      }}
      className="text-muted transition-colors hover:text-foreground"
      title="复制完整密钥"
    >
      {ok ? <Check size={14} className="text-success" /> : <Copy size={14} />}
    </button>
  );
}

/* ---------------- 页面 ---------------- */

export function OverviewPage() {
  const user = useUser();
  const [tokens] = useTokens();
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">概览</h1>
      <p className="mb-6 text-sm text-muted">账户总览与平台使用情况</p>

      {user && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="text-sm text-muted">用户名</div>
            <div className="mt-1 font-semibold">{user.username}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="text-sm text-muted">角色</div>
            <div className="mt-1 font-semibold">{roleName(user.role)}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="text-sm text-muted">API 令牌</div>
            <div className="mt-1 font-semibold">{tokens.length} 个</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="text-sm text-muted">注册时间</div>
            <div className="mt-1 font-semibold">{fmtTime(user.created_time)}</div>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-2 font-semibold">快速开始</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-muted">
          <li>在「API 令牌」页创建 sk- 密钥</li>
          <li>
            请求头携带密钥调用 <code className="rounded bg-accent px-1">POST /api/fgo</code> 转发 GraphQL
          </li>
          <li>上游会话由平台代持，无需关心 kejifuwu 登录态</li>
        </ol>
        <Link
          to="/console/tokens"
          className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-onprimary hover:opacity-90"
        >
          去创建令牌
        </Link>
      </div>
    </div>
  );
}

export function OrdersPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">代肝订单</h1>
      <p className="mb-6 text-sm text-muted">平台代为执行的 FGO 任务列表</p>

      {isDemo ? (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">游戏账号</th>
                <th className="px-4 py-3">任务</th>
                <th className="px-4 py-3">进度</th>
                <th className="px-4 py-3">状态</th>
              </tr>
            </thead>
            <tbody>
              {demoOrders.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">#{o.id}</td>
                  <td className="px-4 py-3">{o.game_account}</td>
                  <td className="px-4 py-3">{o.quest}</td>
                  <td className="px-4 py-3">{o.progress}</td>
                  <td className="px-4 py-3">
                    <Badge tone={o.status === '已完成' ? 'success' : 'primary'}>{o.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted">
          订单功能已透传至上游（/api/fgo），可视化下单界面开发中
        </div>
      )}
    </div>
  );
}

export function TokensPage() {
  const [tokens, reload] = useTokens();
  const [name, setName] = useState('');
  const [unlimited, setUnlimited] = useState(false);
  const [err, setErr] = useState('');
  const [created, setCreated] = useState<Token | null>(null);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await api.post('/token', { name, unlimited_quota: unlimited });
      if (res.data.success) {
        setName('');
        setCreated(res.data.data);
        reload();
      } else {
        setErr(res.data.msg || '创建失败');
      }
    } catch {
      setErr('网络错误');
    }
  };

  const remove = async (id: number) => {
    try {
      await api.delete(`/token/${id}`);
      reload();
    } catch {
      setErr('删除失败');
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">API 令牌</h1>
      <p className="mb-6 text-sm text-muted">用于程序化调用转发接口的 sk- 密钥</p>

      {created && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 p-3 text-sm">
          <Check size={16} className="shrink-0 text-success" />
          <span className="shrink-0 text-muted">新令牌（只显示一次）：</span>
          <code className="flex-1 break-all font-mono">{created.key}</code>
          <CopyBtn text={created.key} />
        </div>
      )}
      {err && <p className="mb-4 text-sm text-red-500">{err}</p>}

      {!isDemo && (
        <form
          onSubmit={create}
          className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="令牌名称，如：我的脚本"
            required
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={unlimited}
              onChange={(e) => setUnlimited(e.target.checked)}
            />
            无限额度
          </label>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-onprimary hover:opacity-90"
          >
            创建令牌
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3">名称</th>
              <th className="px-4 py-3">密钥</th>
              <th className="px-4 py-3">额度</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">创建时间</th>
              {!isDemo && <th className="px-4 py-3">操作</th>}
            </tr>
          </thead>
          <tbody>
            {tokens.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  暂无令牌
                </td>
              </tr>
            )}
            {tokens.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 font-mono text-xs">
                    {t.key.slice(0, 12)}…
                    <CopyBtn text={t.key} />
                  </span>
                </td>
                <td className="px-4 py-3">
                  {t.unlimited_quota ? <Badge tone="success">无限</Badge> : t.remain_quota}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={t.status === 1 ? 'success' : 'muted'}>
                    {t.status === 1 ? '启用' : '禁用'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted">{fmtTime(t.created_time)}</td>
                {!isDemo && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => remove(t.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      删除
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        使用方式：请求头携带 <code className="rounded bg-accent px-1">Authorization: &lt;sk-...&gt;</code> 调用
        <code className="rounded bg-accent px-1">POST /api/fgo</code>
      </p>
    </div>
  );
}

export function SettingsPage() {
  const user = useUser();
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">个人设置</h1>
      <p className="mb-6 text-sm text-muted">账户信息</p>
      {user && (
        <div className="max-w-lg rounded-xl border border-border bg-card p-6 shadow-sm">
          <dl className="space-y-4">
            <div className="flex justify-between border-b border-border pb-3">
              <dt className="text-sm text-muted">用户名</dt>
              <dd className="text-sm">{user.username}</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <dt className="text-sm text-muted">昵称</dt>
              <dd className="text-sm">{user.display_name || '-'}</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <dt className="text-sm text-muted">角色</dt>
              <dd className="text-sm">{roleName(user.role)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted">注册时间</dt>
              <dd className="text-sm">{fmtTime(user.created_time)}</dd>
            </div>
          </dl>
          <p className="mt-6 rounded-lg bg-accent p-3 text-xs text-muted">
            修改密码、绑定邮箱等功能将在后续版本提供
          </p>
        </div>
      )}
    </div>
  );
}
