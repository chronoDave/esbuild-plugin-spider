import test from 'tape';
import fs from 'fs';

import write from './write';
import init from './write.struct';

test('[write] writes page file', async t => {
  const { root, page, cleanup } = await init();

  try {
    await write({ root })(page);

    t.true(fs.existsSync(page.out));
  } catch (err) {
    t.fail((err as Error).message);
  }

  await cleanup();
  t.end();
});

test('[write] ignores asset if not specified', async t => {
  const { root, stylesheet, cleanup } = await init();

  try {
    await write({ root })(stylesheet.nested);

    t.false(fs.existsSync(stylesheet.nested.out));
  } catch (err) {
    t.fail((err as Error).message);
  }

  await cleanup();
  t.end();
});

test('[write] writes asset if specified', async t => {
  const { root, stylesheet, cleanup } = await init();

  try {
    await write({
      root,
      assets: [{ filter: /\.css$/u }]
    })(stylesheet.root);

    t.true(fs.existsSync(stylesheet.root.out));
  } catch (err) {
    t.fail((err as Error).message);
  }

  await cleanup();
  t.end();
});

test('[write] writes asset with path if specified', async t => {
  const { root, stylesheet, cleanup } = await init();

  try {
    await write({
      root,
      assets: [{ filter: /\.css$/u, path: 'css' }]
    })(stylesheet.nested);

    t.true(fs.existsSync(stylesheet.nested.out));
  } catch (err) {
    t.fail((err as Error).message);
  }

  await cleanup();
  t.end();
});
