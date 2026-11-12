# 构建前端（同源部署时 VITE_API_BASE 留空，走 nginx 反代的 /api）
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install
COPY . .
ARG VITE_API_BASE=""
ENV VITE_API_BASE=$VITE_API_BASE
RUN bun run build

# 产物交给 nginx，内嵌 API 反代配置（见 nginx.conf）
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
