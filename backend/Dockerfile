FROM node:20-alpine AS base

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile; \
    else npm ci; \
    fi

FROM base AS builder

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY tsconfig.json .
COPY src ./src

RUN npx tsc

FROM node:20-alpine AS runner

WORKDIR /app

# Instalar dockerize para aguardar o PostgreSQL
RUN apk add --no-cache wget
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-alpine-linux-amd64-v0.6.1.tar.gz

COPY --from=builder /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY package.json .

# Comando padrão aguarda o banco e inicia a aplicação
CMD ["dockerize", "-wait", "tcp://logo-ali-db:5432", "-timeout", "30s", "node", "./dist/index.js"]