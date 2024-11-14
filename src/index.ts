import type { Plugin } from 'esbuild';

import createSpider from '@chronocide/spider';

import path from 'path';
import fsp from 'fs/promises';

export default (): Plugin => ({
  name: '@chronocide/esbuild-plugin-spider',
  setup: build => {
    build.initialOptions.write = false; // As spider sets output locations, write must be disabled
    build.initialOptions.metafile = true; // Metafile must be enabled to get a reference to the source file
    build.initialOptions.format = 'esm'; // Spider only supports esm formatting
    build.initialOptions.bundle = true; // Files must be bundled

    const spider = createSpider({ outdir: build.initialOptions.outdir, write: true });

    build.onEnd(async results => {
      if (!results.metafile) throw new Error('Missing metafile');
      if (!results.outputFiles) throw new Error('Missing outputFiles');

      const files = await Promise.all(results.outputFiles.map(async file => {
        const id = file.path
          .replace(process.cwd(), '')
          .replaceAll(path.sep, '/')
          .slice(1);
        const input = results.metafile?.outputs[id]?.entryPoint;

        return {
          id,
          buffer: Buffer.from(file.text),
          stats: typeof input === 'string' ? await fsp.stat(input) : undefined
        };
      }));

      await Promise.all(files.map(async file => {
        try {
          return await spider(file.buffer, file.stats);
        } catch (err) {
          throw new Error(`${file.id}: ${(err as Error).message}`);
        }
      }));
    });
  }
});
