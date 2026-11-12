# VPS 一键部署指南

GitHub Pages 国内访问不稳，正式站建议单 VPS 全栈部署（前端 + 后端 + 可选 MySQL 同机）。

## 1. 准备 VPS

任意云厂商的入门机器即可（1 核 1G 够跑）。安装 Docker：

```bash
curl -fsSL https://get.docker.com | sh
```

## 2. 拉代码 + 配置环境变量

```bash
git clone https://github.com/sansenjian/fgo-addon.git
cd fgo-addon
cp deploy/env.example .env   # 见下文，自行填写
```

`.env`（即 deploy/env.example 内容）：

```bash
JWT_SECRET=随机长字符串
KEJIFUWU_USERNAME=sansan2
KEJIFUWU_PASSWORD='@Aa1979432414'
# 可选：切 MySQL
# DB_TYPE=mysql
# DB_DSN='root:密码@tcp(db:3306)/fgo?charset=utf8mb4&parseTime=True&loc=Local'
# MYSQL_ROOT_PASSWORD=密码
```

## 3. 启动

```bash
# SQLite 零依赖启动
docker compose -f deploy/docker-compose.yml up -d --build

# 或 MySQL 模式
docker compose -f deploy/docker-compose.yml --profile mysql up -d --build
```

访问 `http://服务器IP` 即可。SQLite 数据在卷 `fgo-data`（容器内 `/data/fgo.db`）。

## 4. HTTPS（强烈建议，浏览器混内容策略要求）

最简单的方式——再装一个 Caddy 容器自动签证书：

```bash
# Caddyfile
你的域名.com {
    reverse_proxy web:80
}
```

```bash
docker run -d --name caddy --network fgo-addon_default \
  -p 80:80 -p 443:443 -v $PWD/Caddyfile:/etc/caddy/Caddyfile caddy:2
```

（域名 A 记录先指向服务器 IP；`fgo-addon_default` 是 compose 项目自动创建的网络名。）

## 5. 更新

```bash
git pull && docker compose -f deploy/docker-compose.yml up -d --build
```

## 与 GitHub Pages 演示站的关系

- **正式站**：本方案（VPS 单源），用户注册/下单真实生效
- **演示站**：Pages 继续保留给海外访问者；两者互不影响
