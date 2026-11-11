# fgo-addon

FGO 全自动代肝服务中转站（对标 kejifuwu.windycloud.cn），**数据库与 Web 技术与 new-api 对齐**。

## 架构

```
用户 → 本站注册/登录 → 拿 JWT 或 sk- 令牌
     → POST /api/fgo（GraphQL 透传）
     → 服务端代持 kejifuwu 账号（SM4 加密密码登录 → JWT 注入，401 自动重登）
     → 上游 https://graphql.fatego.cn/graphql
```

- 上游前端：Vue3 + Vuetify SPA；上游后端：GraphQL（JWT）。本站保持 new-api 技术栈不变。
- 上游密码传输用魔改 SM4（密钥 `FateGoAutoAddon2025`），纯 Go 实现在 `server/upstream/sm4.go`，已对真实服务器验证（注册+登录通过）。

## 技术栈对照

| 层 | new-api | 本项目 |
|---|---|---|
| 后端框架 | Go + Gin v1.9 | Go + Gin v1.9.1 |
| ORM / 数据库 | GORM + SQLite/MySQL | GORM + SQLite/MySQL |
| 鉴权 | JWT + bcrypt | 同左 |
| 前端构建 | Rsbuild + Bun | Rsbuild + Bun |
| 前端框架 | React 19 + TypeScript | React 19 + TypeScript |
| CSS | Tailwind CSS 4 | Tailwind CSS 4 |
| 路由 | TanStack Router | TanStack Router |

## 目录结构

```
fgo-addon/
├── server/
│   ├── config/        # 环境变量配置
│   ├── model/         # GORM 模型（users / tokens）
│   ├── middleware/    # JWT 鉴权
│   ├── controller/    # 用户 / 令牌 / GraphQL 透传
│   ├── upstream/      # kejifuwu GraphQL 适配 + SM4（核心）
│   └── router/
├── web/               # React 前端（首页/登录/注册/控制台）
└── docs/API.md        # 完整接口文档（含上游操作清单）
```

## 运行

```bash
cd server && go mod tidy && go run .     # :3000，默认 SQLite
cd web && bun install && bun run dev     # :5173，/api 代理到 :3000
```

生产：

```bash
export DB_TYPE=mysql DB_DSN='...' JWT_SECRET='...'
export KEJIFUWU_USERNAME='<上游账号>' KEJIFUWU_PASSWORD='<上游密码>'
```

上游账号需充值积分后方可创建订单（见 docs/API.md）。

## Plan B：浏览器兜底登录

上游若改版加密导致服务端自动登录失效：用 `tools/browser-login/` 无头浏览器脚本登录拿 JWT，设 `KEJIFUWU_TOKEN` 环境变量即切换为静态 token 模式，服务端无需改代码。详见该目录 README。

## 前端静态部署（GitHub Pages / 任意静态托管）

前端构建产物是纯静态文件，与后端分离部署：

```bash
cd web
echo 'VITE_API_BASE=https://api.你的域名.com/api' > .env.production
bun install && bun run build:gh   # 产物在 web/dist（含 404.html 用于 SPA 回退）
```

- **GitHub Pages**：推 main 自动部署（`.github/workflows/pages.yml`），仓库 Settings → Pages 选 "GitHub Actions" 源；在 Settings → Secrets and variables → Actions → Variables 添加 `API_BASE`（你的后端地址）。注意：**私有仓库开 Pages 需要 GitHub Pro**。
- **免费替代**：Cloudflare Pages / Vercel，构建命令 `bun run build:gh`，输出目录 `web/dist`，环境变量同样设 `VITE_API_BASE`。
- **国内访问**：GitHub Pages 不稳定，建议阿里云 OSS / 腾讯云 COS + CDN 托管 `dist`。
- 后端 CORS 已放开（`cors.AllowAll`），跨域直接可用；但前端是 HTTPS 时后端也必须 HTTPS，否则浏览器拦截混合内容。

## 仓库

https://github.com/sansenjian/fgo-addon （私有）
