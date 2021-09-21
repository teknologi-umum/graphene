import esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    format: 'esm',
    platform: 'node',
    external: [
      '@sentry/node',
      '@tinyhttp/proxy-addr',
      'dotenv',
      'flourite',
      'helmet',
      'polka',
      'rate-limiter-flexible',
      'sharp',
      'shiki',
      'sirv',
    ],
    outdir: 'dist',
    target: ['es2019', 'node14'],
    tsconfig: 'tsconfig.json',
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
