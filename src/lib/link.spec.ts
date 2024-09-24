import test from 'tape';
import esbuild from 'esbuild';

import link from './link';

test('[link] links metafile and output files', async t => {
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

  const files = link(result.metafile.outputs, result.outputFiles);

  t.equal(files.length, 1, 'has output file');
  t.true(files[0].text, 'has text');
  t.true(files[0].css, 'has css');
  t.true(files[0].lastModified instanceof Date, 'has last modified');

  t.end();
});
