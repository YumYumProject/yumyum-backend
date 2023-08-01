FROM node:current-alpine

WORKDIR /app

COPY . .

ENV MONGO_URI="foo"
ENV REDIS_URL="redis://localhost:6379"
ENV PORT=8000

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

EXPOSE 8000/TCP

CMD ["node", "dist/app.js"]
