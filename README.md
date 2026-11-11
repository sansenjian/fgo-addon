# fgo-addon

FGO 全自动代肝服务平台（对标 kejifuwu.windycloud.cn 的功能形态），**数据库与 Web 技术与 new-api 完全对齐**。

## 技术栈对照

| 层 | new-api | 本项目 |
|---|---|---|
| 后端框架 | Go + Gin v1.9 | Go + Gin v1.9.1 |
| ORM / 数据库 | GORM + SQLite/MySQL/PostgreSQL | GORM + SQLite/MySQL |
| 鉴权 | JWT (golang-jwt) + bcrypt | 同左 |
| 前端构建 | Rsbuild + Bun | Rsbuild + Bun |
| 前端框架 | React 19 + TypeScript | React 19 + TypeScript |
| CSS | Tailwind CSS 4 | Tailwind CSS 4 |
| 路由 | TanStack Router | TanStack Router |
| 请求/状态 | axios + zustand | axios + zustand |

## 目录结构

```
fgo-addon/
├── server/            # Go 后端（对齐 new-api 分层：config/model/middleware/controller/router）
│   ├── main.go
│   ├── config/        # 环境变量配置（.env 或系统环境变量）
│   ├── model/         # GORM 模型（users 表，字段风格对齐 new-api）
│   ├── middleware/    # JWT 鉴权中间件
│   ├── controller/    # 注册 / 登录 / 用户信息
│   └── router/        # Gin 路由，/api 前缀
└── web/               # 前端（rsbuild + bun，/api 代理到 :3000）
    └── src/
        ├── pages/     # 首页(营销落地页) / 登录 / 注册 / 控制台
        └── api/       # axios 实例（Bearer token，同 new-api 约定）
```

## 运行

后端（默认 SQLite，开箱即用）：

```bash
cd server
go mod tidy
go run .
```

前端：

```bash
cd web
bun install
bun run dev   # http://localhost:5173，/api 已代理到 :3000
```

生产用 MySQL：

```bash
export DB_TYPE=mysql
export DB_DSN='user:pass@tcp(127.0.0.1:3306)/fgo?charset=utf8mb4&parseTime=True&loc=Local'
export JWT_SECRET='<随机长字符串>'
```

## API

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | /api/user/register | 注册 `{username, nickname?, password}` |
| POST | /api/user/login | 登录，返回 `{token, user}` |
| GET | /api/user/self | 当前用户信息（需 Authorization: Bearer） |

## 待补齐

kejifuwu 注册后的后台业务（商品/订单/卡密/代肝任务）无法从外部探测，需注册后确认结构，再按同样分层补 model + controller + 页面。
