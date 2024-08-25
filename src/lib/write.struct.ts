import type { OutputFile } from 'esbuild';
import path from 'path';
import fsp from 'fs/promises';

type Page = {
  in: string;
  out: string;
  text: string;
};

type Output = {
  file: OutputFile;
  out: string;
};

const outputFile = (page: Page): Output => ({
  out: path.join(process.cwd(), page.out),
  file: {
    contents: Buffer.from(page.text),
    hash: page.text,
    text: page.text,
    path: path.join(process.cwd(), page.in)
  }
});

export default async () => {
  const root = path.join(process.cwd(), 'tmp');
  const page = outputFile({
    in: 'tmp/about/about.js',
    out: 'tmp/about.html',
    text: 'export default { url: "/about", html: "" };'
  });

  const stylesheet = {
    base: outputFile({
      in: 'tmp/about/about.css',
      out: 'tmp/about.css',
      text: 'body {}'
    }),
    nested: outputFile({
      in: 'tmp/about/about.css',
      out: 'tmp/css/about.css',
      text: 'body {}'
    })
  };

  const json = outputFile({
    in: 'tmp/blog/blog.json',
    out: 'tmp/json/blog.json',
    text: 'export default () => console.log("")'
  });

  await fsp.mkdir(root, { recursive: true });

  return {
    root,
    page,
    json,
    stylesheet,
    cleanup: () => fsp.rm(root, { recursive: true, force: true })
  };
};

