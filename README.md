# Graphene

Generate a beautiful code snippet using [Shiki](https://shiki.matsu.io).

![demo.png](./demo.png)

## Usage

Send a `POST` request to `https://teknologi-umum-graphene.fly.dev/` with the following JSON body payload:

- `code` - The code.
- `lang` - The language used for highlighting. See [shikijs/language](https://github.com/shikijs/shiki/blob/main/docs/languages.md)
- `username` - Used for window title.

## Development

You will need a puppeteer-supported browser installed, and Node.js v16.

```shell
npm install
npm run start
```

### TODO:

- [x] Deploy
- [ ] Front end for ease of use
- [ ] Auto language detection
