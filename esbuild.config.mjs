import esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: 'main.js',
    format: 'cjs',
    platform: 'node',
    target: 'node16',
    external: ['obsidian'],
    logLevel: 'info',
  })
  .catch(() => process.exit(1));
