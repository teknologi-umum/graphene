FROM node:20.10-bookworm

WORKDIR /home/app

RUN npm install --global pnpm

COPY fonts/ /usr/local/share/fonts/

# Files required by pnpm install
COPY pnpm-lock.yaml ./

ADD . ./

RUN pnpm install && \
  pnpm -r run build

WORKDIR /home/app/packages/backend

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE ${PORT}

CMD [ "pnpm", "start" ]
