[shiki-link]: https://shiki.matsu.io
[shiki-lang-link]: https://github.com/shikijs/shiki/blob/main/docs/languages.md
[shiki-theme-link]: https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes
[flourite-link]: https://github.com/teknologi-umum/flourite

# Graphene

Generate a beautiful code snippet using [Shiki][shiki-link].

<kbd>

![demo.png](./demo/demo.png)

</kbd>

## Usage

Graphene has two ways of usage.

### Web Interface

TBD

### API

Send a `POST` request to `https://teknologi-umum-graphene.fly.dev/api` with the following JSON body payload:

- `code` - The code snippet. Required!
- `lang` - The language used for highlighting. See [shikijs/language][shiki-lang-link]. Default value is empty which means [flourite][flourite-link] will try its best to guess it.
- `format` - Valid options are `jpeg` and `png`. Default value is `png`.
- `upscale` - Self explanatory. Default value is `1`.
- `theme` - The colorscheme. See [shiki-theme][shiki-theme-link] for the list of valid options. Default value is `github-dark`.
- `font` - Valid options are `SF Mono`, `JetBrains Mono` and `Fira Code`. Default value is `JetBrains Mono`.

Example request:

```json
{
  "code": "import shiki from \"shiki\";\n\n/**\n * Generate a highlighted code\n * @param {string} code - Raw code\n * @param {string} lang - Language\n * @return {Promise<string>} Highlighted code in HTML string\n */\nexport const getResult = async (code, lang) => {\n  const highlighter = await shiki.getHighlighter({ theme: 'dark-plus' });\n  const result = highlighter.fooToBar(code, lang);\n  return result;\n};",
  "theme": "nord",
  "format": "jpeg",
  "upscale": 3,
  "lang": "javascript",
  "font": "fira code"
}
```

## Development

You will need a puppeteer-supported browser installed, and Node.js >=16.

- `npm install` - Your typical 5 million packages installation
- `npm run start` - Start the fun stuff
- `EXEC_PATH=/path/to/chromium npm run test` - Make sure everything works correctly
