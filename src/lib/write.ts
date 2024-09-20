import type { OutputFile } from 'esbuild';

import { bundle } from '@chronocide/spider';
import path from 'path';
import fsp from 'fs/promises';

export type Asset = {
  filter: RegExp;
  path: string;
};

export type WriteOptions = {
  root: string;
  /** Spider entry file filter, defaults to `.js` */
  filter?: RegExp;
  /** Asset output directory, expects file type and location */
  assets?: Asset[];
};

export default async (files: OutputFile[], options?: WriteOptions): Promise<void> => {
  const pages = new Map<string, string>();
  const filter = options?.filter ?? /\.js$/u;

  await Promise.all(files
    .filter(file => filter.test(file.path))
    .map(async page => {
      try {
        const result = await bundle(Buffer.from(page.contents));
        if (!result) return;

        pages.set(path.parse(page.path).dir, path.parse(result.path).dir);
  
        await fsp.writeFile(path.join(options?.root ?? process.cwd(), result.path), result.html);
      } catch (err) {
        throw new Error(`${(err as Error).message} at ${page.path}`);
      }
    })
  );

  /**
   * 1) Find all non-page files (assets)
   * 2) If asset is imported by a page, it'll share the same dir
   *    If so, get that dir (as it's changed by spider)
   * 3) If there's an asset filter, apply asset path
   *    /:root:/:filter:/:dir:/, e.g.
   * 
   *    page: /src/about/about.js (url /about)
   *    css: /src/about/about.css
   * 
   *    outdir:      /dist
   *    filter path: /css
   * 
   *    out: /dist/css/about.css
   */

  await Promise.all(files
    .filter(file => !filter.test(file.path) && pages.has(path.parse(file.path).dir))
    .map(async file => {
      const asset = path.parse(file.path);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const dir = pages.get(asset.dir)!.replace(options?.root ?? process.cwd(), '');
      const root = options?.assets?.find(asset => asset.filter.test(file.path))?.path ?? '';
      const out = path.join(options?.root ?? process.cwd(), root, dir, asset.base);

      await fsp.mkdir(path.parse(out).dir, { recursive: true });
      await fsp.writeFile(out, file.text);
    }));
};
