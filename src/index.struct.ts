import type { BuildResult } from 'esbuild';

import esbuild from 'esbuild';
import path from 'path';
import fsp from 'fs/promises';

import spider from './index';

export type File = {
  path: string;
  data: string;
};

export type StructResult = {
  root: string;
  cleanup: () => Promise<void>;
  build: () => Promise<BuildResult>;
};

export default async (file: File): Promise<StructResult> => {
  const outdir = 'tmp';
  const root = path.join(process.cwd(), outdir);
  const cleanup = async () => fsp.rm(root, { recursive: true, force: true });

  try {
    await fsp.mkdir(root);
    await fsp.writeFile(path.join(root, file.path), file.data);
  } catch (err) {
    await cleanup();

    throw err;
  }

  return {
    root,
    cleanup,
    build: async () => esbuild.build({
      entryPoints: ['tmp/**/*.ts'],
      plugins: [spider()],
      outdir
    })
  };
};
