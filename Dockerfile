FROM node:16-buster

WORKDIR /usr/src/temp

RUN apt-get update \
    && apt-get install unzip curl \
    && curl https://www.cdnfonts.com/download/sf-mono-cdnfonts.zip -o sf-mono.zip \
    && curl https://github.com/tonsky/FiraCode/releases/download/5.2/Fira_Code_v5.2.zip -o fira-code.zip \
    && curl https://download.jetbrains.com/fonts/JetBrainsMono-2.242.zip -o jetbrains-mono.zip \
    && unzip sf-mono.zip -d sf-mono/ \
    && unzip fira-code.zip -d fira-code/ \
    && unzip jetbrains-mono.zip -d jetbrains-mono/ \
    && mv -v sf-mono /usr/local/share/fonts/ \
    && mv -v fira-code /usr/local/share/fonts/ \
    && mv -v jetbrains-mono /usr/local/share/fonts/ \
    && rm -v fira-code.zip jetbrains-mono.zip sf-mono.zip

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build \
    && rm -rf node_modules \
    && npm install --production

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
