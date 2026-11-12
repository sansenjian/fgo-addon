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
    <main className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="mb-6 flex items-center justify-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-onprimary">
          G
        </span>
        <span className="text-xl font-bold">用户名注册</span>
      </div>

      {isDemo && (
        <div className="mb-4 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-warning">
          演示模式：无需注册，
          <Link to="/console" className="underline">直接进入演示控制台</Link>
        </div>
      )}

      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm text-muted">用户名</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={2}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">昵称（可空）</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2 font-medium text-onprimary transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? '注册中…' : '注册'}
        </button>
        <p className="text-center text-sm text-muted">
          已有账号？{' '}
          <Link to="/login" className="text-primary hover:underline">
            去登录
          </Link>
        </p>
      </form>
    </main>
  );
}
