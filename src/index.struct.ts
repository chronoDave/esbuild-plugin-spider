import type { BuildResult } from 'esbuild';

import esbuild from 'esbuild';
import path from 'path';
import fsp from 'fs/promises';

import spider from './index.ts';

export type File = {
  path: string;
  data: string;
};

export type StructResult = {
  root: string;
  init: () => Promise<void>;
  cleanup: () => Promise<void>;
  build: () => Promise<BuildResult>;
};

export default (file: File): StructResult => {
  const outdir = 'tmp';
  const root = path.join(process.cwd(), outdir);

  return {
    root,
    init: async () => {
      await fsp.mkdir(root);
      await fsp.writeFile(path.join(root, file.path), file.data);
    },
    cleanup: async () => fsp.rm(root, { recursive: true, force: true }),
    build: async () => esbuild.build({
      entryPoints: ['tmp/**/*.ts'],
      plugins: [spider()],
      outdir
    })
  };
};
