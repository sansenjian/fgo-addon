import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';

import { api } from '../api/client';
import { isDemo } from '../demo';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/user/register', {
        username,
        nickname,
        password,
      });
      const data = res.data;
      if (!data.success) {
        setError(data.msg || '注册失败');
        return;
      }
      navigate({ to: '/login' });
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-sm flex-col px-4 py-16">
      {isDemo && (
        <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-300">
          演示模式：无需注册，
          <Link to="/console" className="underline">直接进入演示控制台</Link>
        </div>
      )}
      <h1 className="mb-6 text-center text-2xl font-bold text-white">
        用户名注册
      </h1>
      <form
        onSubmit={submit}
        className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6"
      >
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="用户名"
          required
          minLength={2}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
        />
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="昵称 (可空)"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          required
          minLength={6}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? '注册中…' : '注册'}
        </button>
        <p className="text-center text-sm text-slate-400">
          已有账号？{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">
            去登录
          </Link>
        </p>
      </form>
    </main>
  );
}
