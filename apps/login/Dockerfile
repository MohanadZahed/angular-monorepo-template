FROM node:24.14.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY . .

RUN npx nx build login --configuration=production

FROM nginx:alpine

COPY --from=builder /app/dist/apps/login /usr/share/nginx/html
COPY apps/login/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
