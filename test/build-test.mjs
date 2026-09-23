import esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['test/run.ts'],
    bundle: true,
    outfile: 'test/_out.js',
    platform: 'node',
    format: 'cjs',
    alias: { obsidian: './test/stub-obsidian.ts' },
    logLevel: 'info',
  })
  .catch(() => process.exit(1));
