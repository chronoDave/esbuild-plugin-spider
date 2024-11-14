import test from 'tape';
import fsp from 'fs/promises';
import path from 'path';

import setup from './index.struct';

test('[esbuild-plugin-spider] builds files', async t => {
  const { root, cleanup } = await setup();

  try {
    t.true(await fsp.stat(path.join(root, '/index.html')), 'has index');
    t.true(await fsp.stat(path.join(root, '/about.html')), 'has about');
    t.true(await fsp.stat(path.join(root, '/blog/a.html')), 'has blog');
  
    const file = await fsp.readFile(path.join(root, '/index.html'), 'utf-8');
  
    t.true(/<p>\d+\.\d+<\/p>/.test(file), 'returns input file stats');
  } catch (err) {
    t.fail((err as Error).message);
  }

  await cleanup();
  t.end();
});
