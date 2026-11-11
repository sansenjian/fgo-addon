import { Link } from '@tanstack/react-router';

const features = [
  {
    title: '自动打怪刷本',
    desc: '定时扫荡日常副本，无需值守，素材自动入账。',
  },
  {
    title: '素材获取',
    desc: '珍贵素材精准规划，活动商店、周常任务全托管。',
  },
  {
    title: '角色快速升级',
    desc: '狗粮本自动连刷，从者等级、技能材料一站搞定。',
  },
  {
    title: '精准定位需求',
    desc: '按你的box定制代肝方案，系统精准匹配最优路线。',
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <section className="text-center">
        <p className="mb-4 inline-block rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-sm text-indigo-300">
          Welcome to Game Auto Addon
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          全自动代肝服务
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          具备自动打怪刷本功能，无论你是想获取珍贵的素材，还是为角色快速升级，我们的系统都能精准定位需求。
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/register"
            className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500"
          >
            立即注册
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-200 hover:bg-slate-800"
          >
            用户登录
          </Link>
        </div>
      </section>

      <section className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <h3 className="text-lg font-semibold text-white">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
