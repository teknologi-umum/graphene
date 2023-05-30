# Contributing Guide

Hello! We'd love to see your contribution on this repository soon, even if it's just a typo fix!

Contributing means anything from reporting bugs, ideas, suggestion, code fix, even new feature.

Bear in mind to keep your contributions under the [Code of Conduct](./github/CODE_OF_CONDUCT.md) for the community.

## Bug report, ideas, and suggestion

The [issues](https://github.com/teknologi-umum/graphene/issues) page is a great way to communicate to us. Other than that, we have a [Telegram group](https://t.me/teknologi_umum) that you can discuss your ideas into. If you're not an Indonesian speaker, it's 100% fine to talk in English there.

Please make sure that the issue you're creating is in as much detail as possible. Poor communication might lead to a big mistake, we're trying to avoid that.

## Pull request

**A big heads up before you're writing a breaking change code or a new feature: Please open up an [issue](https://github.com/teknologi-umum/graphene/issues) regarding what you're working on, or just talk in the [Telegram group](https://t.me/teknologi_umum).**

### Prerequisites

You will need a few things to get things working:

1. Node.js current version (as of now, we're using v18.16.0 as defined in the `.nvmrc` file). You can install it through the [official Node.js download page](https://nodejs.org/en/download/), but we recommend using [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm). Here's a simple installation/setup guide, but you should really refer directly to the corresponding repository's README.

```sh
# If you want to install fnm
$ curl -fsSL https://fnm.vercel.app/install | bash

# Then simply use this command
$ fnm use

# OR if you want to install nvm
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

$ nvm use
```

2. This repo uses pnpm workspace to share the code between the backend and the frontend. There are multiple ways to install `pnpm`, please refer to the [official installation guide for pnpm](https://pnpm.io/installation)

3. [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) if you want to test the app using docker. (Optional)

### Getting Started

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own Github account and [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Run `pnpm install` to install the dependencies needed across all workspaces.
3. You can use [postman](https://www.postman.com/), [insomnia](https://insomnia.rest/) or [hoppscotch](https://hoppscotch.io/) to create an API request.

Conventional commit is not required in this repo since this was supposed to be a toy project but ended up to be a kinda serious-ish thing. Do whatever you want with the commit message :)

### Testing your change

#### Backend
It's really up to you to have an unit test or not. But if you do, just create one on the `tests` directory, and run the test with:

```sh
# single run
pnpm test

# watch
pnpm test:watch

# collect coverage
pnpm test:coverage
```

We're using [Vitest](https://vitest.dev) as the test runner.

### Before creating a PR

Please run ESLint and Prettier with these commands so you're good on the CI process.

```sh
pnpm lint
pnpm fmt:write # or fmt:check if you don't want prettier to automatically format your code
```

And you're set!

### NPM scripts

#### Available on both workspaces

- `pnpm install` - Your typical 5 million packages installation.
- `pnpm start` - Start the fun stuff, make sure you've run the build step before running this.
- `pnpm dev` - When you want stuff to be automagically reloaded.
- `pnpm lint` - Check the files from your silly mistakes.
- `pnpm lint:fix` - Fix your mistakes
- `pnpm fmt:check` - Feeling your code isn't pretty?
- `pnpm fmt:write` - You like pretty formatted code, right?

#### Extra command for frontend

- `pnpm build` - Build everything into a static files.

#### Extra command for backend

- `pnpm test` - Make sure everything works correctly.
- `pnpm test:watch` - When you can't be bothered to run `pnpm test` multiple times.
- `pnpm test:coverage` - Make sure you don't miss anything.

#### Only available from project root

- `npm run docker:build` - Prepare for 'it works on my machine' solution.
- `npm run docker:run` - 'it works on my machine' is no more.
