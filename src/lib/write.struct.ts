import esbuild from 'esbuild';
import fsp from 'fs/promises';
import path from 'path';
import { notNull } from './is';

import link from './link';
import transform from './transform';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async () => {
  const outdir = 'tmp';
  const root = path.resolve(process.cwd(), outdir);

  const result = await esbuild.build({
    entryPoints: [
      'test/page.ts',
      'test/plugin.ts'
    ],
    outdir,
    write: false,
    metafile: true,
    bundle: true,
    format: 'esm',
    packages: 'external',
    platform: 'node'
  });

  const files = await Promise.all(link(result.metafile.outputs, result.outputFiles).map(transform))
    .then(files => files.filter(notNull));

  return {
    files,
    root,
    cleanup: async () => fsp.rm(root, { recursive: true, force: true })
  };
};
