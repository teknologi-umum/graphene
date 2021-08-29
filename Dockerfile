FROM node:16.6.2-alpine3.13

WORKDIR /usr/src/app

ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    dumb-init \
    udev \
    ttf-freefont \
    chromium \
    && npm install puppeteer-core@5.3.1 --silent \
    && apk del --no-cache make gcc g++ binutils-gold gnupg libstdc++ \
    && rm -rf /usr/include \
    && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/* \
    && echo

COPY package*.json ./

RUN npm install

COPY . .

ENV EXEC_PATH="/usr/bin/chromium-browser"

EXPOSE 3000

CMD [ "node", "src/index.js" ]