import test from 'tape';
import fs from 'fs';
import path from 'path';

import init from './write.struct';
import write from './write';

test('[write] writes output files', async t => {
  const { root, files, cleanup } = await init();

  await Promise.all(files.map(write(root)));

  try {
    t.true(fs.existsSync(path.resolve(root, 'index.html')), 'has index.html');
    t.true(fs.existsSync(path.resolve(root, 'index.css')), 'has index.css');
    t.true(fs.existsSync(path.resolve(root, 'esbuild/plugin/spider.html')), 'has esbuild/plugin/spider.html');
    t.true(fs.existsSync(path.resolve(root, 'esbuild/plugin/spider.css')), 'has esbuild/plugin/spider.css');
  } catch (err) {
    t.fail((err as Error).message);
  }

  await cleanup();
  t.end();
});
