import { Link } from '@tanstack/react-router';
import { isDemo } from '../demo';

const stats = [
  { label: '累计完成订单', value: '12,800+' },
  { label: '进行中任务', value: '342' },
  { label: '平均交付时长', value: '2.4 小时' },
  { label: '服务可用率', value: '99.9%' },
];

const features = [
  { title: '自动打怪刷本', desc: '定时扫荡日常副本，无需值守，素材自动入账。' },
  { title: '素材获取', desc: '珍贵素材精准规划，活动商店、周常任务全托管。' },
  { title: '角色快速升级', desc: '狗粮本自动连刷，从者等级、技能材料一站搞定。' },
  { title: '精准定位需求', desc: '按你的 box 定制代肝方案，系统精准匹配最优路线。' },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <p className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm text-primary">
            Welcome to Game Auto Addon
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            全自动代肝服务
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            具备自动打怪刷本功能，无论你是想获取珍贵的素材，还是为角色快速升级，
            我们的系统都能精准定位需求。
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/register"
              className="rounded-lg bg-primary px-6 py-3 font-medium text-onprimary transition-opacity hover:opacity-90"
            >
              立即注册
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-border bg-card px-6 py-3 font-medium transition-colors hover:bg-background"
            >
              用户登录
            </Link>
          </div>
          {isDemo && (
            <p className="mt-4 text-sm text-warning">演示站 · 点击右上角「控制台」免登录预览</p>
          )}
        </div>
      </section>

      {/* 数据一览 */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 功能特性 */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold">平台功能</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
