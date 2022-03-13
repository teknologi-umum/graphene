FROM node:16.13.1-bullseye

WORKDIR /home/node/tmp

COPY fonts/ /usr/local/share/fonts/

WORKDIR /home/node/app

COPY . .

RUN npm install --workspaces

ENV NODE_ENV=production

RUN npm run build --workspaces \
    && rm -rf node_modules \
    && npm install --production --workspaces

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
