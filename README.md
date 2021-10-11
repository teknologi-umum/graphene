[shiki-link]: https://shiki.matsu.io
[shiki-lang-link]: https://github.com/shikijs/shiki/blob/main/docs/languages.md
[shiki-theme-link]: https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes
[flourite-link]: https://github.com/teknologi-umum/flourite
[sharp-link]: https://github.com/lovell/sharp

<kbd>

![logo.png](./scratch/logo.png)

</kbd>

---

## Usage

Please visit https://graphene.teknologiumum.com for Graphene Web UI and its documentation.

## I'm here for Hacktoberfest, what can I do?

If you're new to open source, we really recommend reading a few articles about contributing to open source projects:

- [Open Source Guide's How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Hacktoberfest Contributor's Guide: How To Find and Contribute to Open-Source Projects](https://www.digitalocean.com/community/tutorials/hacktoberfest-contributor-s-guide-how-to-find-and-contribute-to-open-source-projects)
- [Tips for high-quality Pull Request](https://twitter.com/sudo_navendu/status/1437456596473303042)

You can start by reading the [CONTRIBUTING.md](./CONTRIBUTING.md). Then you can search for [issues that you can work on](https://github.com/teknologi-umum/graphene/issues?q=is%3Aopen+is%3Aissue+label%3Ahacktoberfest).

Have fun!

## FAQ

### Why Shiki?

Because it gives pretty much the same _accurate_ highlighting as Visual Studio Code. Though it won't highlight it semantically since it still uses RegEx.

### How it works

- You send a request with stuff
- Graphene does its magic
- ???
- Profit

<details>

<summary>ok sorry, click here for the real answer</summary>

- You send a POST request with a JSON body containing [valid options](#api)
- It will Highlight the code using Shiki and apply some options
- Then, render the result to svg using [custom svg renderer](./src/logic/svgRenderer.ts) which is a heavily modified version of the [original svg renderer](https://github.com/shikijs/shiki/tree/main/packages/renderer-svg)
- Apply border, upscale, and convert to the desired output format using [sharpjs][sharp-link]
- Send it back to you

</details>

### ..what is up with the commit messages?

I don't even know

### Why do I prefer this over, say, carbon.now.sh?

Well, I made this because I want it to be used programatically, without having to open a browser and doing it myself.
Because it uses [shiki][shiki-link], the highlight produced is more accurate, it's identical to the one used in vscode.
