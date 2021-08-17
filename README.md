# Graphene

Generate a beautiful code snippet using [Shiki](https://shiki.matsu.io).

![demo.png](./demo.png)

## Usage

Send a `POST` request to `https://teknologi-umum-graphene.fly.dev/` with the following JSON body payload:

- `code` - The code.
- `lang` - The language used for highlighting. See [shikijs/language](https://github.com/shikijs/shiki/blob/main/docs/languages.md). Default value is `auto` (WIP)
- `username` - Used for window title.
- `format` - Valid options are `mozjpeg` and `oxipng`. Default value is `oxipng`
- `upscale` - Self explanatory. Default value is `1`

Example request:

```
POST http://yourdomain/api/shot HTTP/1.1
Content-Type: application/json

{
  "code": "import asdf from \"shiki\";\n\n/**\n * Generate a highlighted code\n * @param {string} code - Raw code\n * @param {string} lang - Language\n * @return {Promise<string>} Highlighted code in HTML string\n */\nexport const getResult = async (code, lang) => {\n  const highlighter = await shiki.getHighlighter({ theme: 'dark-plus' });\n  const result = highlighter.fooToBar(code, lang);\n  return result;\n};",
  "lang": "js",
  "username": "manusia_bernapas_ii",
  "format": "mozjpeg",
  "upscale": 3
}
```

## Development

You will need a puppeteer-supported browser installed, and Node.js v16.

```shell
npm install
npm run start
```
