# 一阶段执行构建

FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install pnpm -g
RUN pnpm install
COPY . .
RUN pnpm run build

# 二阶段执行部署
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html