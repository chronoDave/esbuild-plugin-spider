import type { File } from './index.struct.ts';

import test from 'node:test';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

import setup from './index.struct.ts';

void test('[esbuild-plugin-spider] builds files', async t => {
  const file: File = { path: 'blog.ts', data: 'export const url = "/blog/"; export default "<h1>blog</h1>";' };
  const { cleanup, root, build, init } = setup(file);

  try {
    await init();
    await build();

    const out = path.resolve(root, 'blog/index.html');
    t.assert.equal(fs.existsSync(out), true, 'writes file');

    const raw = await fsp.readFile(out, 'utf-8');
    t.assert.equal(raw, '<h1>blog</h1>', 'writes html');

    await fsp.rm(path.join(root, file.path));
    await build();
    const cached = await fsp.readFile(out, 'utf-8');
    t.assert.equal(cached, '<h1>blog</h1>', 'writes from cache');

    await fsp.writeFile(path.join(root, file.path), 'export const url = "/about"; export default "<h1>blog</h1>";');
    await build();
    t.assert.equal(fs.existsSync(path.resolve(root, 'about.html')), true, 'busts cache');

    await cleanup();
  } catch (err) {
    t.assert.fail(err as Error);
  } finally {
    await cleanup();
  }
});
