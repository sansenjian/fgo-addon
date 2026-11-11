# fgo-addon API 接口文档

架构：**用户注册我们的站 → 拿 JWT（网页）或 sk- 令牌（API）→ 调我们的 `/api/fgo`（GraphQL 透传）→ 服务端用 SM4 加密密码登录上游 kejifuwu 拿 JWT 并注入转发**。与 new-api「令牌 + 渠道转发」模型同构。

上游事实（已实测验证）：

- 前端：Vue 3 + Vuetify SPA（kejifuwu.windycloud.cn，静态托管，无 REST API）
- 后端：GraphQL 单端点 `https://graphql.fatego.cn/graphql`（JWT 鉴权，Bearer 注入）
- 密码传输：SM4-ECB+PKCS7（密钥硬编码 `FateGoAutoAddon2025`，base64），Go 实现在 `server/upstream/sm4.go`
- 签发方 "Games Auto Add-on"，token 有效期 7 天（适配层已做 401 自动重登）

Base URL：`http://localhost:3000/api`（开发）；生产为 `https://你的域名/api`

统一响应格式（本站接口）：

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

返回 `{ token, user }`，token 为本站 JWT（72h）。

### GET /user/self — 当前用户信息（需鉴权）

---

## 二、令牌（new-api 风格）

### GET /token — 我的令牌列表（需鉴权）

### POST /token — 创建令牌（需鉴权）

```bash
curl -X POST $BASE/token -H "Authorization: Bearer $JWT" \
  -H 'Content-Type: application/json' \
  -d '{"name":"我的脚本","unlimited_quota":true}'
```

| 字段 | 类型 | 说明 |
|---|---|---|
| name | string ✓ | 备注名 |
| expired_time | int | 秒级时间戳，0/不传 = 永不过期 |
| remain_quota | int | 初始额度 |
| unlimited_quota | bool | 无限额度 |

返回 `key`：`sk-<32位hex>`，只显示一次。

### DELETE /token/:id — 删除令牌（需鉴权）

---

## 三、转发接口（核心，GraphQL 透传）

### POST /fgo — 转发到上游 GraphQL（需鉴权）

请求体为 GraphQL 标准格式，**原样透传**给 `graphql.fatego.cn/graphql`：

```bash
curl -X POST $BASE/fgo \
  -H "Authorization: sk-xxxxxxxx" \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query { meUserInfo { userName points permissions vipExpireAt isSvip } }"
  }'
```

- 上游会话由服务端用 `KEJIFUWU_USERNAME/PASSWORD` 自动登录维护（SM4 加密 + JWT 注入 + 401 重登重试）
- 响应（含 errors）原样回传，状态码同步

### 上游已确认可用的操作清单（从其前端 JS 提取）

**用户**：`registerByUserName(userName, password, nickName)`、`login(userNameOrEmail, password) → {token, userName}`、`meUserInfo { userName nickName points permissions bindCountLeft infinitePoolDrawCount friendPoint vipExpireAt isSvip }`、`meUserId`、`changePasswordByOldPassword`、`bindEmail(email, baseUrl)`、`getSiteName`

**Fate/GO 订单**：`CreateOrder`、`StartOrder`、`PauseOrder`、`FinishOrder`、`DeleteOrder`、`GetFateGoOrders`、`getFateGoOrderCount`

**友情点**：`CreateFriendPointOrder`、`GetFriendPointOrders`、`GetFriendPointGroupedOrders`、`addFriendPointClaim`

**游戏账号**：`GetGameAccountInfo`、`bindCountLeft`

**无限池**：`GetInfinitePoolQuest`、`getInfinitePoolDrawRecord`

具体字段以 `query { __schema { types { name fields { name } } } }` 内省结果为准（上游 GraphQL 通常开放内省，可直接拉完整 schema）。

---

## 四、服务端配置（环境变量）

| 变量 | 默认值 | 说明 |
|---|---|---|
| `DB_TYPE` | `sqlite` | `sqlite` / `mysql` |
| `DB_DSN` | `fgo.db` | MySQL: `user:pass@tcp(127.0.0.1:3306)/fgo?charset=utf8mb4&parseTime=True&loc=Local` |
| `JWT_SECRET` | `change-me-in-production` | 生产必须改 |
| `PORT` | `3000` | 监听端口 |
| `KEJIFUWU_GRAPHQL_ENDPOINT` | `https://graphql.fatego.cn/graphql` | 上游 GraphQL 端点 |
| `KEJIFUWU_USERNAME` | — | 我们持有的上游账号 |
| `KEJIFUWU_PASSWORD` | — | 上游账号明文密码（服务端 SM4 加密后传输） |

## 五、备注

- 上游账号需要**充值积分**才能创建订单；`permissions` 为 `User`，`vipExpireAt`/`isSvip` 控制会员功能
- 上游账号注册（备号）：`registerByUserName`，密码规则为字母+数字+符号（客户端 SM4 密文传输）
