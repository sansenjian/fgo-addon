# browser-login（Plan B 兜底）

当上游 kejifuwu 改版加密算法或接口，导致服务端 `server/upstream` 的密码自动登录失效时，用无头浏览器真实走一遍登录流程拿 JWT。

## 用法

```bash
cd tools/browser-login
npm install
KEJIFUWU_USERNAME=sansan2 KEJIFUWU_PASSWORD='xxx' CHROME_PATH=/usr/bin/chromium node login.js
```

输出：

```json
{"token":"eyJhbGciOiJIUzI1NiIs..."}
```

## 接入服务端（静态 token 模式）

```bash
export KEJIFUWU_TOKEN='eyJhbGciOiJIUzI1NiIs...'   # 上面脚本输出的 token
cd ../../server && go run .
```

服务端检测到 `KEJIFUWU_TOKEN` 即跳过密码登录，直接使用该 JWT 转发；token 7 天到期后重跑本脚本换新。

## 依赖

- Node.js + puppeteer-core（本机需有 Chromium/Chrome，`CHROME_PATH` 指向可执行文件）
