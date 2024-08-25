import type { OutputFile } from 'esbuild';

import { bundle } from  '@chronocide/spider';
import path from 'path';
import fsp from 'fs/promises';

export type Asset = {
  filter: RegExp;
  path?: string;
};

export type WriteOptions = {
  root: string;
  /** Spider entry file filter, defaults to `.js` */
  filter?: RegExp;
  /** Asset output directory, expects file type and location */
  assets?: Asset[];
};

export default (options: WriteOptions) => async (file: OutputFile) => {
  if ((options.filter ?? /\.js$/u).test(file.path)) {
    const result = await bundle(Buffer.from(file.contents));

    await fsp.writeFile(path.join(options.root, result.path), result.html);
  } else {
    const assets = options.assets?.filter(asset => asset.filter.test(file.path)) ?? [];

    await Promise.all(assets?.map(async asset => {
      const rel = file.path.replace(options.root, '');
      const out = path.join(options.root, asset.path ?? '', rel);

      await fsp.mkdir(path.parse(out).dir, { recursive: true });
      return fsp.writeFile(out, file.text);
    }));
  }
};
