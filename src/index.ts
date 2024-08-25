import type { Plugin } from 'esbuild';
import type { WriteOptions } from './lib/write';

export type { Asset } from './lib/write';

import fsp from 'fs/promises';

import createWrite from './lib/write';

export type SpiderOptions = Omit<WriteOptions, 'root'>;

export default (options: SpiderOptions): Plugin => ({
  name: '@chronocide/esbuild-plugin-spider',
  setup: async build => {
    build.initialOptions.write = false; // Spider overwrites esbuild output

    if (build.initialOptions.outdir) await fsp.mkdir(build.initialOptions.outdir, { recursive: true });
    const root = build.initialOptions.outdir ?? process.cwd();
    const write = createWrite({ ...options, root });

    build.onEnd(results => results.outputFiles?.forEach(async file => {
      try {
        write(file);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }));
  }
});
