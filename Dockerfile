FROM node:20-alpine AS builder

COPY package.json package-lock.json ./

RUN npm install

COPY index.html vite.config.js ./
COPY public public
COPY server server
COPY web web

RUN npm run build

RUN mkdir /build && \
    mv dist server package.json package-lock.json /build

WORKDIR /build

RUN npm install --production

FROM node:20-alpine

RUN adduser --disabled-password fsdm

WORKDIR /home/fsdm

COPY --from=builder /build .

USER fsdm

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
