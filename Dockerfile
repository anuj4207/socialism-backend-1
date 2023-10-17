# Building layer
FROM node:18-alpine 

WORKDIR /app

COPY tsconfig*.json ./
COPY package*.json ./

RUN npm install
COPY ./src src
COPY ./prisma prisma
ENV DATABASE_URL=${ENV}
ENV JWT_SECRET = 'secret'
#RUN npm run build
EXPOSE 3000

CMD ["npm","run","start:dev"]