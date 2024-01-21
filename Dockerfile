FROM oven/bun:slim as base

ENV NODE_ENV production

RUN apt-get update && apt-get install -y openssl && apt-get install -y curl && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

FROM base as deps

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --dev

FROM base as production-deps

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --production

FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

COPY prisma ./prisma/

RUN bunx prisma generate

COPY . .

RUN bun run build

FROM base

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY . .

CMD ["bun", "run", "start"]
