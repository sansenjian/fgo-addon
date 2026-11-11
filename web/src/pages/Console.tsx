import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';

import { api } from '../api/client';

interface UserInfo {
  id: number;
  username: string;
  display_name: string;
  role: number;
  created_time: number;
}

export default function Console() {
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
              <dd className="text-white">
                {new Date(user.created_time * 1000).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      )}
      {!user && !error && <p className="text-slate-400">加载中…</p>}
      <p className="mt-6 text-sm text-slate-500">
        业务模块（订单、卡密、代肝任务）待确认 kejifuwu 后台结构后补齐 →{' '}
        <Link to="/" className="text-indigo-400 hover:underline">
          返回首页
        </Link>
      </p>
    </main>
  );
}
