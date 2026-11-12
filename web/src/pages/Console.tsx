import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';

import { api } from '../api/client';
import { isDemo, demoUser, demoTokens, demoOrders } from '../demo';

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

function fmtTime(ts: number) {
  return ts > 0 ? new Date(ts * 1000).toLocaleString() : '永不过期';
}

const roleName = (r: number) =>
  r === 100 ? '超级管理员' : r === 10 ? '管理员' : '用户';

/* ---------------- 令牌管理（概览页内 tab） ---------------- */

function TokenPanel({ tokens, onChanged, readOnly }: {
  tokens: Token[];
  onChanged?: () => void;
  readOnly?: boolean;
}) {
  const [name, setName] = useState('');
  const [unlimited, setUnlimited] = useState(false);
  const [err, setErr] = useState('');

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await api.post('/token', { name, unlimited_quota: unlimited });
      if (res.data.success) {
        setName('');
        onChanged?.();
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
      onChanged?.();
    } catch {
      setErr('删除失败');
    }
  };

  return (
    <div>
      {!readOnly && (
        <form
          onSubmit={create}
          className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
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
      {err && <p className="mb-4 text-sm text-red-500">{err}</p>}

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3">名称</th>
              <th className="px-4 py-3">密钥</th>
              <th className="px-4 py-3">额度</th>
              <th className="px-4 py-3">创建时间</th>
              {!readOnly && <th className="px-4 py-3">操作</th>}
            </tr>
          </thead>
          <tbody>
            {tokens.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  暂无令牌
                </td>
              </tr>
            )}
            {tokens.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{t.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{t.key.slice(0, 16)}…</td>
                <td className="px-4 py-3">
                  {t.unlimited_quota ? (
                    <span className="text-success">无限</span>
                  ) : (
                    t.remain_quota
                  )}
                </td>
                <td className="px-4 py-3 text-muted">{fmtTime(t.created_time)}</td>
                {!readOnly && (
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
        使用方式：请求头携带 <code>Authorization: &lt;sk-...&gt;</code> 调用 /api/fgo 转发接口。
      </p>
    </div>
  );
}

/* ---------------- 概览 ---------------- */

function Overview({ user }: { user: UserInfo }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="text-sm text-muted">用户名</div>
        <div className="mt-1 font-semibold">{user.username}</div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="text-sm text-muted">昵称</div>
        <div className="mt-1 font-semibold">{user.display_name || '-'}</div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="text-sm text-muted">角色</div>
        <div className="mt-1 font-semibold">{roleName(user.role)}</div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="text-sm text-muted">注册时间</div>
        <div className="mt-1 font-semibold">{fmtTime(user.created_time)}</div>
      </div>
    </div>
  );
}

function OrdersPreview() {
  return (
    <div className="mt-6">
      <h2 className="mb-4 font-semibold">代肝订单</h2>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
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
                  <span className={o.status === '已完成' ? 'text-success' : 'text-primary'}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- 页面 ---------------- */

type Tab = 'overview' | 'tokens';

function DemoConsole() {
  const [tab, setTab] = useState<Tab>('overview');
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-warning">
        演示模式 · 以下为示例数据，仅用于功能预览。
      </div>
      <h1 className="mb-6 text-2xl font-bold">控制台</h1>
      <TabBar tab={tab} setTab={setTab} />
      <div className="mt-6">
        {tab === 'overview' ? (
          <>
            <Overview user={demoUser} />
            <OrdersPreview />
          </>
        ) : (
          <TokenPanel tokens={demoTokens} readOnly />
        )}
      </div>
    </main>
  );
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const tabs = [
    { key: 'overview' as Tab, label: '概览' },
    { key: 'tokens' as Tab, label: '令牌' },
  ];
  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={
            'border-b-2 px-4 py-2 text-sm transition-colors ' +
            (tab === t.key
              ? 'border-primary font-medium text-foreground'
              : 'border-transparent text-muted hover:text-foreground')
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function RealConsole() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [user, setUser] = useState<UserInfo | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState('');

  const load = () => {
    api
      .get('/user/self')
      .then((res) => res.data.success && setUser(res.data.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate({ to: '/login' });
        }
      });
    api
      .get('/token')
      .then((res) => res.data.success && setTokens(res.data.data))
      .catch(() => {});
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate({ to: '/login' });
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">控制台</h1>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <TabBar tab={tab} setTab={setTab} />
      <div className="mt-6">
        {tab === 'overview' ? (
          user ? (
            <Overview user={user} />
          ) : (
            <p className="text-muted">加载中…</p>
          )
        ) : (
          <TokenPanel tokens={tokens} onChanged={load} />
        )}
      </div>
      <p className="mt-8 text-sm text-muted">
        <Link to="/" className="text-primary hover:underline">
          返回首页
        </Link>
      </p>
    </main>
  );
}

export default function Console() {
  if (isDemo) return <DemoConsole />;
  return <RealConsole />;
}
