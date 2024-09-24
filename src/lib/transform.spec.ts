import test from 'tape';
import esbuild from 'esbuild';

import link from './link';
import transform from './transform';

test('[transform] transforms and bundles output file', async t => {
  const result = await esbuild.build({
    entryPoints: ['test/page.ts'],
    outdir: 'build',
    write: false,
    metafile: true,
    bundle: true,
    format: 'esm',
    packages: 'external',
    platform: 'node'
  });

  const files = await Promise.all(link(result.metafile.outputs, result.outputFiles).map(transform));

  t.equal(files.length, 1, 'has output file');
  t.equal(files[0]?.path, 'index.html', 'has path');
  t.true(files[0]?.css, 'has css');
  t.true(files[0]?.html, 'has html');
  t.true(Array.isArray(files[0]?.redirects), 'has redirects');

  t.end();
});
