# Build stage
FROM node:24.14.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY . .

RUN npx nx build angular-monorepo-template --configuration=production

# Runtime stage
FROM node:24.14.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist/angular-monorepo-template ./dist/angular-monorepo-template

EXPOSE 4000

CMD ["node", "dist/angular-monorepo-template/server/server.mjs"]