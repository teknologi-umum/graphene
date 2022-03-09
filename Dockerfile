FROM node:16.14.0-bullseye

USER node

RUN mkdir -p /home/node

WORKDIR /home/node/tmp

COPY fonts/ /usr/local/share/fonts/

WORKDIR /home/node/app

COPY --chown=node:node package.json .

RUN npm install --workspaces

COPY --chown=node:node . .

ENV NODE_ENV=production

RUN npm run build --workspaces \
    && rm -rf node_modules \
    && npm install --production --workspaces

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
