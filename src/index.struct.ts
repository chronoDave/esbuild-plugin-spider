import esbuild from 'esbuild';
import path from 'path';
import fsp from 'fs/promises';

import plugin from './index';

export type File = {
  file: string;
  data: string;
};

export type StructResult = {
  root: string;
  files: Record<string, File>;
  cleanup: () => Promise<void>;
};

export default async (): Promise<StructResult> => {
  const outdir = 'tmp';
  const root = path.join(process.cwd(), outdir);

  const files = {
    about: {
      file: path.join(root, 'about.ts'),
      data: 'export const url = "/about"; export default "<p>About</p>";'
    },
    home: {
      file: path.join(root, 'home.ts'),
      data: 'export const url = "/"; export default ({ ctimeMs }) => `<p>${ctimeMs}</p>`'
    },
    blog: {
      file: path.join(root, 'blog.ts'),
      data: 'export const url = "/blog/entry"; export default "<p>Blog entry</p>";'
    }
  };

  await fsp.mkdir(root);
  await Promise.all(Object.values(files).map(async ({ file, data }) => fsp.writeFile(file, data)));

  await esbuild.build({
    entryPoints: ['tmp/**/*.ts'],
    plugins: [plugin()],
    outdir
  });

  return {
    root,
    files,
    cleanup: async () => fsp.rm(root, { recursive: true, force: true })
  };
};
