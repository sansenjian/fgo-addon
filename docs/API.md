# fgo-addon API 接口文档

架构：**用户注册我们的站 → 拿 JWT（网页）或 sk- 令牌（API）→ 调我们的 `/api/fgo/*` → 服务端注入我们持有的 kejifuwu 账号会话转发到上游**。与 new-api「令牌 + 渠道转发」模型同构。

Base URL：`http://localhost:3000/api`（开发）；生产为 `https://你的域名/api`

统一响应格式：

```json
{ "success": true, "msg": "", "data": { } }
```

鉴权方式（二选一）：
- 网页：`Authorization: Bearer <JWT>`（登录返回，72 小时有效）
- API：`Authorization: <sk-xxxx>` 或 `Bearer <sk-xxxx>`

---

## 一、用户

### POST /user/register — 注册

```bash
curl -X POST $BASE/user/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"test","nickname":"测试","password":"123456"}'
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| username | string | ✓ | 2-64 字符，唯一 |
| nickname | string | | 可空 |
| password | string | ✓ | 6-72 字符，bcrypt 存储 |

### POST /user/login — 登录

```bash
curl -X POST $BASE/user/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"test","password":"123456"}'
```

返回：

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": 1, "username": "test", "display_name": "测试", "role": 1, "created_time": 1762886400 }
  }
}
```

### GET /user/self — 当前用户信息（需鉴权）

```bash
curl $BASE/user/self -H "Authorization: Bearer $JWT"
```

---

## 二、令牌（new-api 风格）

### GET /token — 我的令牌列表（需鉴权）

### POST /token — 创建令牌（需鉴权）

```bash
curl -X POST $BASE/token \
  -H "Authorization: Bearer $JWT" \
  -H 'Content-Type: application/json' \
  -d '{"name":"我的脚本","unlimited_quota":true}'
```

| 字段 | 类型 | 说明 |
|---|---|---|
| name | string ✓ | 备注名 |
| expired_time | int | 秒级时间戳，0/不传 = 永不过期 |
| remain_quota | int | 初始额度 |
| unlimited_quota | bool | 无限额度 |

返回 data 中含 `key`，格式 `sk-<32位hex>`，**只显示这一次**。

### DELETE /token/:id — 删除令牌（需鉴权）

---

## 三、转发接口（核心）

### ANY /fgo/*path — 转发到 kejifuwu（需鉴权）

路径映射规则：

```
我们的接口                    上游实际请求
──────────────────────────────────────────────────────────
POST /api/fgo/user/login  →  POST {KEJIFUWU_BASE_URL}/api/user/login
GET  /api/fgo/task/list   →  GET  {KEJIFUWU_BASE_URL}/api/task/list
任意方法、任意 body、任意 query 原样透传
```

- 上游会话（cookie 或 Authorization）由服务端用 `KEJIFUWU_USERNAME` / `KEJIFUWU_PASSWORD` 自动登录维护，401 自动重登重试
- 响应状态码、Content-Type、body 原样回传

```bash
# 示例：用 sk- 令牌调用上游某个业务接口
curl -X POST $BASE/fgo/task/start \
  -H "Authorization: sk-xxxxxxxx" \
  -H 'Content-Type: application/json' \
  -d '{"account":"100,100,100","config":{}}'
```

---

## 四、服务端配置（环境变量）

| 变量 | 默认值 | 说明 |
|---|---|---|
| `DB_TYPE` | `sqlite` | `sqlite` / `mysql` |
| `DB_DSN` | `fgo.db` | MySQL: `user:pass@tcp(127.0.0.1:3306)/fgo?charset=utf8mb4&parseTime=True&loc=Local` |
| `JWT_SECRET` | `change-me-in-production` | 生产必须改 |
| `PORT` | `3000` | 监听端口 |
| `KEJIFUWU_BASE_URL` | `https://kejifuwu.windycloud.cn` | 上游地址 |
| `KEJIFUWU_USERNAME` | — | 我们持有的 kejifuwu 账号 |
| `KEJIFUWU_PASSWORD` | — | 账号密码 |
| `KEJIFUWU_API_PREFIX` | `/api` | 上游业务接口前缀 |
| `KEJIFUWU_LOGIN_PATH` | `/api/user/login` | 上游登录接口路径 |

---

## 五、待确认（需要浏览器抓包）

上游 kejifuwu 的真实接口路径无法从外部探测，请在浏览器 F12 → Network 里操作它的后台，抓出以下信息后填进配置：

1. **登录请求**：真实的登录 URL、请求体字段名、响应里会话是 token 还是 cookie（决定了 `KEJIFUWU_LOGIN_PATH` 和鉴权注入方式）
2. **业务接口清单**：每个功能（开任务/查状态/买卡密…）对应的 method + path + body
3. 如果后台走 WebSocket（任务实时推送），需要额外加 WS 透传（后续可补）

拿到抓包结果后，把第 2 点整理成表追加到本文档第三节即可。
