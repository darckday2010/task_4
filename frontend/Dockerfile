FROM node:22-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 5173
# --host нужен, чтобы Vite отвечал на запросы извне контейнера
CMD ["yarn", "dev", "--host"]