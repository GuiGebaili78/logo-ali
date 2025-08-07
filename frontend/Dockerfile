# frontend/Dockerfile (Configuração para Desenvolvimento)
FROM node:20-alpine AS base

WORKDIR /app

# Copia package.json e instala dependências
# Usamos npm ci para instalações limpas e consistentes
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile; \
    else npm ci; \
    fi

# Para desenvolvimento, não precisamos de um estágio 'builder' separado para 'npm run build'
# O 'npm run dev' será executado diretamente no container.
# Apenas copiamos o restante do código fonte.
COPY . .

EXPOSE 3000

# O comando para iniciar o Next.js em modo de desenvolvimento
# Este comando será sobrescrito pelo 'command' no docker-compose.yml
CMD ["npm", "run", "dev"]
