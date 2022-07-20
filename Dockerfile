FROM node:18.6.0-alpine3.16

WORKDIR /home/app

RUN apk add curl

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY fonts/ /usr/local/share/fonts/

# Files required by pnpm install
COPY pnpm-lock.yaml ./

# cache into the global store
RUN pnpm fetch

ADD . ./

RUN pnpm install -r --offline

# build the frontend code
RUN cd ./packages/frontend && pnpm build

WORKDIR ./packages/backend

ENV NODE_ENV=production

EXPOSE 3000
CMD [ "pnpm", "start" ]
