import esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    format: 'esm',
    platform: 'node',
    external: [
      '@logtail/node',
      '@sentry/node',
      '@tinyhttp/proxy-addr',
      'dotenv',
      'flourite',
      'gura',
      'helmet',
      'polka',
      'rate-limiter-flexible',
      'sharp',
      'shiki',
      'sirv',
      'toml',
      'yaml',
    ],
    outdir: '../dist',
    target: ['es2021', 'node16.10'],
    tsconfig: 'tsconfig.json',
  })
  .catch((e) => {
    /* eslint-disable-next-line */
    console.error(e);
    process.exit(1);
  });
