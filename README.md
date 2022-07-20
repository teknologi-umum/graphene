[shiki-link]: https://shiki.matsu.io
[shiki-lang-link]: https://github.com/shikijs/shiki/blob/main/docs/languages.md
[shiki-theme-link]: https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes
[flourite-link]: https://github.com/teknologi-umum/flourite
[sharp-link]: https://github.com/lovell/sharp

<kbd>

![logo.png](./.github/assets/logo.png)

</kbd>

---

## Usage

Please visit https://graphene.teknologiumum.com for Graphene Web UI and its documentation.

## FAQ

### How to contribute?

You can read [CONTRIBUTING.md](./CONTRIBUTING.md) before making your PR.

### Why Shiki?

Because it gives pretty much the same _accurate_ highlighting as Visual Studio Code. Though it won't highlight it semantically since it still uses RegEx.

### How it works

- You send a request with stuff
- Graphene does its magic
- ???
- Profit

<details>

<summary>ok sorry, click here for the real answer</summary>

- You send a POST request with a JSON body containing [valid options](https://graphene.teknologiumum.com/#documentation)
- It will highlight the code using Shiki
- Then, it will render the result to svg using [our custom svg renderer](./backend/src/logic/svgRenderer.ts) which is a heavily modified version of [the original svg renderer](https://github.com/shikijs/shiki/tree/main/packages/renderer-svg) that shiki has.
- Apply border, upscale, and convert to the desired output format using [sharpjs][sharp-link]
- Send it back to you

</details>

### ..what is up with the commit messages?

I don't even know. This was meant to be a toy project so I just put whatever that came to mind when writing the commit message, but now it became an actual thing.

### Why do I prefer this over, say, carbon.now.sh?

Well, I made this because I want it to be used programatically, without having to open a browser and doing it myself, or having to scrape carbon.now.sh website using something like puppeteer.

Because it uses [Shiki][shiki-link], the highlight produced is more accurate, it's identical to the one used in Visual Studio Code.
