import { Link } from '@tanstack/react-router';
import {
  Bot,
  Package,
  TrendingUp,
  Crosshair,
  UserPlus,
  ClipboardList,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { isDemo } from '../demo';

const stats = [
  { label: '累计完成订单', value: '12,800+' },
  { label: '进行中任务', value: '342' },
  { label: '平均交付时长', value: '2.4 小时' },
  { label: '服务可用率', value: '99.9%' },
];

const features = [
  { icon: Bot, title: '自动打怪刷本', desc: '定时扫荡日常副本，无需值守，素材自动入账。' },
  { icon: Package, title: '素材获取', desc: '珍贵素材精准规划，活动商店、周常任务全托管。' },
  { icon: TrendingUp, title: '角色快速升级', desc: '狗粮本自动连刷，从者等级、技能材料一站搞定。' },
  { icon: Crosshair, title: '精准定位需求', desc: '按你的 box 定制代肝方案，系统精准匹配最优路线。' },
];

const steps = [
  { icon: UserPlus, title: '注册账号', desc: '一分钟创建账户，无需绑定游戏账号即可浏览。' },
  { icon: ClipboardList, title: '创建令牌 / 提交订单', desc: '在控制台创建 API 令牌，或提交你要托管的代肝任务。' },
  { icon: Zap, title: '系统自动执行', desc: '平台代持上游会话全天候运行，进度实时可查。' },
];

const faqs = [
  { q: '代肝过程中我的游戏账号安全吗？', a: '平台仅接管任务执行所需的最小权限，全程不触碰账号密码之外的敏感信息，任务日志全程可审计。' },
  { q: '支持哪些类型的任务？', a: '无限池刷本、日常/周常、素材本、QP 本、友情点等，后续将持续扩展活动托管能力。' },
  { q: 'API 方式如何计费？', a: '按创建的订单类型与数量计费，可在控制台查看每笔消耗明细。' },
];

const footerCols = [
  { title: '产品', links: ['首页', '功能', '控制台'] },
  { title: '资源', links: ['API 文档', '状态页', '更新日志'] },
  { title: '关于', links: ['关于我们', '使用条款', '联系方式'] },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_60%)]">
        <div className="flex justify-center px-4 pt-12">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted shadow-sm transition-colors hover:text-foreground"
          >
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
              全新上线
            </span>
            FGO 无限池 / 友情点代肝已开放
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 text-center">
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
              className="rounded-full border border-border bg-card px-7 py-3 font-medium shadow-sm transition-colors hover:bg-accent"
            >
              用户登录
            </Link>
          </div>
          {isDemo && (
            <p className="mt-4 text-sm text-warning">
              演示站 · 点右上角「控制台」免登录预览，数据均为示例
            </p>
          )}
        </div>
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
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon size={20} />
                </div>
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
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon size={20} />
                </div>
                <span className="text-sm font-bold text-muted">STEP {i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">常见问题</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-border bg-card shadow-sm open:pb-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown
                  size={16}
                  className="text-muted transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="px-5 text-sm text-muted">{f.a}</p>
            </details>
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
      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 sm:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-onprimary">
                  G
                </span>
                <span className="text-sm font-bold">Game Auto Addon</span>
              </div>
              <p className="mt-3 text-sm text-muted">全自动 FGO 代肝中转平台</p>
            </div>
            {footerCols.map((col) => (
              <div key={col.title}>
                <div className="mb-3 text-sm font-semibold">{col.title}</div>
                <ul className="space-y-2 text-sm text-muted">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link to="/" className="transition-colors hover:text-foreground">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted">
            © 2026 Game Auto Addon
          </div>
        </div>
      </footer>
    </main>
  );
}
