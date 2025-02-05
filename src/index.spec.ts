import type { File } from './index.struct';

import test from 'tape';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

import setup from './index.struct';

test('[esbuild-plugin-spider] builds files', async t => {
  const file: File = { path: 'blog.ts', data: 'export const url = "/blog"; export default "<h1>blog</h1>";' };

  try {
    const { cleanup, root, build } = await setup(file);
    await build();

    const out = path.resolve(root, 'blog.html');
    t.true(fs.existsSync(out), 'writes file');

    const raw = await fsp.readFile(out, 'utf-8');
    t.equal(raw, '<h1>blog</h1>', 'writes html');

    await fsp.rm(path.join(root, file.path));
    await build();
    const cached = await fsp.readFile(out, 'utf-8');
    t.equal(cached, '<h1>blog</h1>', 'writes from cache');

    await fsp.writeFile(path.join(root, file.path), 'export const url = "/about"; export default "<h1>blog</h1>";');
    await build();
    t.true(fs.existsSync(path.resolve(root, 'about.html')), 'busts cache');

    await cleanup();
  } catch (err) {
    t.fail((err as Error).message);
  }

  t.end();
});
