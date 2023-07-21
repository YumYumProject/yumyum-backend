FROM node:20.4

ENV DATABASE_URL=mongodb://devdb:27017/yumyum PORT=8000 JWT_SECRET=cleverse

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm && \
  pnpm i 

COPY . .

CMD ["pnpm", "dev"]

EXPOSE 8000