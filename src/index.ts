import type { Plugin } from 'esbuild';
import type { ParseOptions, PathOptions, SpiderResult } from '@chronocide/spider';

import createSpider from '@chronocide/spider';
import path from 'path';
import fsp from 'fs/promises';

export type Cached = {
  input: Buffer;
  output: SpiderResult;
};

export type SpiderOptions = {
  parser?: ParseOptions;
  path?: PathOptions;
};

export default (options?: SpiderOptions): Plugin => ({
  name: '@chronocide/esbuild-plugin-spider',
  setup: build => {
    build.initialOptions.write = false; // As spider sets output locations, write must be disabled
    build.initialOptions.format = 'esm'; // Spider only supports esm formatting
    build.initialOptions.bundle = true; // Files must be bundled

    const cache = new Map<string, Cached>();
    const spider = createSpider({
      parser: options?.parser,
      path: {
        outdir: options?.path?.outdir ?? build.initialOptions.outdir
      }
    });

    build.onEnd(async results => {
      if (!results.outputFiles) throw new Error('Missing outputFiles');

      const files = results.outputFiles.map(file => ({
        id: file.path
          .replace(process.cwd(), '')
          .replaceAll(path.sep, '/')
          .slice(1),
        buffer: Buffer.from(file.text)
      }));

      await Promise.all(files.map(async file => {
        try {
          const page = cache.get(file.id);
          let output = page?.output;

          if (!output || !page?.input.equals(file.buffer)) {
            output = await spider(file.buffer);

            cache.set(file.id, { input: file.buffer, output });
          }

          await fsp.writeFile(output.path, output.html);
        } catch (err) {
          throw new Error(`[${file.id}] ${(err as Error).message}`);
        }
      }));
    });
  }
});
