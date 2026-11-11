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

function fmtTime(ts: number) {
  return ts > 0 ? new Date(ts * 1000).toLocaleString() : '永不过期';
}

// 演示模式：本地 mock 数据渲染，无需后端
function DemoConsole() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-300">
        演示模式 · 以下为示例数据，仅用于功能预览。正式站注册后展示真实数据。
      </div>
      <h1 className="mb-6 text-2xl font-bold text-white">控制台</h1>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-4 font-semibold text-white">个人信息</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div><dt className="text-sm text-slate-400">用户名</dt><dd className="text-white">{demoUser.username}</dd></div>
          <div><dt className="text-sm text-slate-400">昵称</dt><dd className="text-white">{demoUser.display_name}</dd></div>
          <div><dt className="text-sm text-slate-400">角色</dt><dd className="text-white">用户</dd></div>
          <div><dt className="text-sm text-slate-400">注册时间</dt><dd className="text-white">{fmtTime(demoUser.created_time)}</dd></div>
        </dl>
      </section>

      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-4 font-semibold text-white">我的令牌</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr><th className="py-2">名称</th><th>密钥</th><th>额度</th><th>状态</th></tr>
            </thead>
            <tbody className="text-slate-200">
              {demoTokens.map((t) => (
                <tr key={t.id} className="border-t border-slate-800">
                  <td className="py-2">{t.name}</td>
                  <td className="font-mono text-xs">{t.key.slice(0, 14)}…</td>
                  <td>{t.unlimited_quota ? '无限' : t.remain_quota}</td>
                  <td>{t.status === 1 ? '启用' : '禁用'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-4 font-semibold text-white">代肝订单</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr><th className="py-2">ID</th><th>游戏账号</th><th>任务</th><th>进度</th><th>状态</th></tr>
            </thead>
            <tbody className="text-slate-200">
              {demoOrders.map((o) => (
                <tr key={o.id} className="border-t border-slate-800">
                  <td className="py-2">#{o.id}</td>
                  <td>{o.game_account}</td>
                  <td>{o.quest}</td>
                  <td>{o.progress}</td>
                  <td>
                    <span className={o.status === '已完成' ? 'text-emerald-400' : 'text-sky-400'}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-6 text-sm text-slate-500">
        <Link to="/" className="text-indigo-400 hover:underline">返回首页</Link>
      </p>
    </main>
  );
}

function RealConsole() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate({ to: '/login' });
      return;
    }
    api
      .get('/user/self')
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          setError(res.data.msg || '获取用户信息失败');
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate({ to: '/login' });
        } else {
          setError('网络错误');
        }
      });
  }, [navigate]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-white">控制台</h1>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {user && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-400">用户名</dt>
              <dd className="text-white">{user.username}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">昵称</dt>
              <dd className="text-white">{user.display_name || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">角色</dt>
              <dd className="text-white">
                {user.role === 100 ? '超级管理员' : user.role === 10 ? '管理员' : '用户'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">注册时间</dt>
              <dd className="text-white">{fmtTime(user.created_time)}</dd>
            </div>
          </dl>
        </div>
      )}
      {!user && !error && <p className="text-slate-400">加载中…</p>}
    </main>
  );
}

export default function Console() {
  if (isDemo) return <DemoConsole />;
  return <RealConsole />;
}
