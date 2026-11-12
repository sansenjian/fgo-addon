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

const steps = [
  { n: '01', title: '注册账号', desc: '一分钟创建账户，无需绑定游戏账号即可浏览。' },
  { n: '02', title: '创建令牌 / 提交订单', desc: '在控制台创建 API 令牌，或提交你要托管的代肝任务。' },
  { n: '03', title: '系统自动执行', desc: '平台代持上游会话全天候运行，进度实时可查。' },
];

export default function Home() {
  return (
    <main>
      {/* 公告条 */}
      <div className="flex justify-center px-4 pt-10">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
            全新上线
          </span>
          FGO 无限池 / 友情点代肝已开放
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-10 pb-20 text-center">
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          全自动<span className="text-primary">代肝</span>服务
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          具备自动打怪刷本功能，无论你是想获取珍贵的素材，还是为角色快速升级，
          我们的系统都能精准定位需求。
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/register"
            className="rounded-full bg-primary px-7 py-3 font-medium text-onprimary transition-opacity hover:opacity-90"
          >
            开始使用
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-border bg-card px-7 py-3 font-medium transition-colors hover:bg-accent"
          >
            用户登录
          </Link>
        </div>
        {isDemo && (
          <p className="mt-4 text-sm text-warning">
            演示站 · 点右上角「控制台」免登录预览，数据均为示例
          </p>
        )}
      </section>

      {/* 数据条 */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <div className="text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 功能 */}
      <section id="features" className="border-t border-border bg-surface/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-2 text-center text-3xl font-bold">平台功能</h2>
          <p className="mb-10 text-center text-muted">覆盖 FGO 日常到活动全场景的托管能力</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使用步骤 */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold">如何使用</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="text-sm font-bold text-primary">{s.n}</div>
              <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-2xl bg-primary px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-onprimary sm:text-3xl">
            现在就开始托管你的 FGO 日常
          </h2>
          <p className="mt-2 text-onprimary/80">注册即可体验全自动代肝，无需安装任何软件</p>
          <Link
            to="/register"
            className="mt-6 inline-block rounded-full bg-onprimary px-7 py-3 font-medium text-primary transition-opacity hover:opacity-90"
          >
            免费注册
          </Link>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted sm:flex-row">
          <span>© 2026 Game Auto Addon</span>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-foreground">首页</Link>
            <Link to="/login" className="hover:text-foreground">登录</Link>
            <Link to="/register" className="hover:text-foreground">注册</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
