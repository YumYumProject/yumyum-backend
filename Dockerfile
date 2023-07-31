FROM node:current-alpine

WORKDIR /app

COPY . .

# ARG APP_VERSION
# ENV APP_VERSION=${APP_VERSION:-"develop"}


# ARG FROM_REPO
# ENV FROM_REPO=${FROM_REPO:-"https://github.com/CleverseAcademy/nodejs-cicd"}



ENV PORT=8000
ENV DATABASE_URL="mongodb+srv://yumyum-user:yumyumsecret@cluster0.pqbm4xu.mongodb.net/EazyEat?retryWrites=true&w=majority"
ENV REDIS_URL="redis://redis-cli:6379"
ENV MONGODB_HOST="localhost"
ENV JWT_SECRET="docker-jwt-secret"
# ENV MONGODB_PORT="27017"
# ENV MONGODB_USERNAME="root"
# ENV MONGODB_PASSWORD="secret"

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

EXPOSE 8000/TCP

CMD ["node", "dist/app.js"]