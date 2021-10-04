FROM node:16.10-buster

ENV NODE_ENV=production

WORKDIR /usr/src/temp

COPY fonts/ .

RUN mv -v sf-mono /usr/local/share/fonts/ \
    && mv -v fira-code /usr/local/share/fonts/ \
    && mv -v jetbrains-mono /usr/local/share/fonts/

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --workspaces \
    && rm -rf node_modules \
    && npm install --production --workspaces

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
