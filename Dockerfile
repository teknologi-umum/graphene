FROM node:18.12-bullseye

WORKDIR /home/app

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY fonts/ /usr/local/share/fonts/

# Files required by pnpm install
COPY pnpm-lock.yaml ./

# cache into the global store
RUN pnpm fetch

ADD . ./

RUN pnpm install -r --offline

# build the frontend code
RUN pnpm --filter "{packages/frontend}" build

WORKDIR /home/app/packages/backend

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE ${PORT}

CMD [ "pnpm", "start" ]
