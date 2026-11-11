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

## 仓库

https://github.com/sansenjian/fgo-addon （私有）
