# Build stage
FROM node:24.14.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY . .

ARG BUILD_ENV=production
RUN npx nx build angular-monorepo-template --configuration=${BUILD_ENV} && \
    npx nx run angular-monorepo-template:server --configuration=${BUILD_ENV}

# Runtime stage
FROM node:24.14.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist/apps/angular-monorepo-template ./dist/apps/angular-monorepo-template

EXPOSE 4000

CMD ["node", "dist/apps/angular-monorepo-template/server/main.js"]