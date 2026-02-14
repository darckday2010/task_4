FROM node:22-alpine

# Устанавливаем необходимые системные библиотеки для Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Сначала копируем только файлы зависимостей
COPY package.json yarn.lock ./
RUN yarn install

# Копируем схему Prisma
COPY prisma ./prisma/

# Генерируем клиент Prisma именно ВНУТРИ контейнера (под Linux)
RUN npx prisma generate

# Копируем остальной код
COPY . .

EXPOSE 4000

CMD ["npx", "nodemon", "--exec", "npx ts-node", "src/index.ts"]