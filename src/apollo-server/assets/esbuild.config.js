import {buildSync} from 'esbuild'

buildSync({
  bundle: true,
  entryPoints: ['src/index.ts'],
  external: ['./node_modules/*'],
  format: 'esm',
  logLevel: 'info',
  minify: true,
  outfile: 'build/index.js',
  platform: 'node',
  sourcemap: 'inline',
})
