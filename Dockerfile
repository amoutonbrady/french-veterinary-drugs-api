FROM node:alpine

ARG FILE_URL="file:./dev.db"
ENV FILE_URL=${FILE_URL}

RUN npm install -g pnpm@next-8

WORKDIR /app

COPY [".npmrc", "package.json", "pnpm-lock.yaml", "./"]

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

EXPOSE 8080
CMD ["pnpm", "start"]