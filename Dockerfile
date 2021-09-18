FROM node:14.17.6-buster

WORKDIR /usr/src/temp

COPY fonts/ .

RUN mv -v sf-mono /usr/local/share/fonts/ \
    && mv -v fira-code /usr/local/share/fonts/ \
    && mv -v jetbrains-mono /usr/local/share/fonts/

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build \
    && rm -rf node_modules \
    && npm install --production

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
