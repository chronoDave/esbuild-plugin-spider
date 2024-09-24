import type { Plugin } from 'esbuild';

import path from 'path';

import transform from './lib/transform';
import link from './lib/link';
import write from './lib/write';
import { notNull } from './lib/is';

export default (): Plugin => {
  const name = '@chronocide/esbuild-plugin-spider';

  return {
    name,
    setup: build => {
      build.initialOptions.write = false; // Spider overwrites esbuild output
      build.initialOptions.metafile = true; // Spider overwrites esbuild metafile

      const root = typeof build.initialOptions.outdir === 'string' ?
        path.join(process.cwd(), build.initialOptions.outdir) :
        process.cwd();

      build.onEnd(async results => {
        if (!results.metafile) throw new Error('Missing metafile');
        if (!results.outputFiles) throw new Error('Missing outputFiles');

        const files = await Promise.all(link(
          results.metafile.outputs,
          results.outputFiles
        ).map(transform)).then(files => files.filter(notNull));

        await Promise.all(files.map(write(root)));
      });
    }
  };
};
