FROM node:16.14.0-bullseye

WORKDIR /app/tmp

COPY fonts/ .

RUN mv -v sf-mono /usr/local/share/fonts/ \
    && mv -v fira-code /usr/local/share/fonts/ \
    && mv -v jetbrains-mono /usr/local/share/fonts/ \
    && mv -v cascadia-code /usr/local/share/fonts/ \
    && mv -v hack /usr/local/share/fonts/ \
    && mv -v iosevka /usr/local/share/fonts/

WORKDIR /app

COPY . .

RUN npm install --workspaces

ENV NODE_ENV=production

RUN npm run build --workspaces \
    && rm -rf node_modules \
    && npm install --production --workspaces

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
