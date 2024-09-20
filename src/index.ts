import type { Plugin } from 'esbuild';
import type { WriteOptions } from './lib/write';

export type { Asset } from './lib/write';

import fsp from 'fs/promises';
import path from 'path';

import write from './lib/write';

export type SpiderOptions = Omit<WriteOptions, 'root'>;

export default (options?: SpiderOptions): Plugin => ({
  name: '@chronocide/esbuild-plugin-spider',
  setup: async build => {
    build.initialOptions.write = false; // Spider overwrites esbuild output

    if (typeof build.initialOptions.outdir === 'string') await fsp.mkdir(build.initialOptions.outdir, { recursive: true });
    const root = typeof build.initialOptions.outdir === 'string' ?
      path.join(process.cwd(), build.initialOptions.outdir) :
      process.cwd();

    build.onEnd(async results => {
      try {
        await write(results.outputFiles ?? [], { ...options, root });
      } catch (err) {
        console.error(err);
      }
    });
  }
});
