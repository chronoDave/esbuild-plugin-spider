import test from 'tape';
import fs from 'fs';
import path from 'path';

import write from './write';
import init from './write.struct';

test('[write] writes page', async t => {
  const { root, page, cleanup } = await init();

  try {
    await write([page.file], { root });

    t.true(fs.existsSync(page.out));

    const date = new Date(+fs.readFileSync(page.out, 'utf-8')).getTime();
    t.true(Date.now() > date, 'sets last modified date');
  } catch (err) {
    t.fail((err as Error).message);
  }

  await cleanup();
  t.end();
});

test('[write] writes asset', async t => {
  const { root, page, stylesheet, cleanup } = await init();

  try {
    await write([page.file, stylesheet.base.file], { root });

    t.true(fs.existsSync(stylesheet.base.out));
  } catch (err) {
    t.fail((err as Error).message);
  }

  await cleanup();
  t.end();
});

test('[write] writes asset with filter path', async t => {
  const { root, page, stylesheet, cleanup } = await init();

  try {
    await write([page.file, stylesheet.nested.file], {
      root,
      assets: [{ filter: /\.css$/u, path: '/css' }]
    });

    t.true(fs.existsSync(stylesheet.nested.out));
  } catch (err) {
    t.fail((err as Error).message);
  }

  await cleanup();
  t.end();
});

test('[write] does not write asset if not imported', async t => {
  const { root, page, json, cleanup } = await init();

  try {
    await write([page.file, json.file], { root });

    t.false(fs.existsSync(json.out));
  } catch (err) {
    t.fail((err as Error).message);
  }

  await cleanup();
  t.end();
});

test('[write] throws readable error', async t => {
  const { root, error, cleanup } = await init();

  try {
    await write([error.file], { root });

    t.fail('expected to throw');
  } catch (err) {
    t.true((err as Error).message.includes(path.parse(error.file.path).base));
  }

  await cleanup();
  t.end();
});

test('[write] ignores empty files', async t => {
  const { empty, root, cleanup } = await init();

  try {
    await write([empty.file], { root });
    t.false(fs.existsSync(empty.out));
  } catch (err) {
    t.fail((err as Error).message);
  }

  await cleanup();
  t.end();
});
