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

  const error = outputFile({
    in: 'tmp/blog/blog.js',
    out: 'tmp/json/blog.html',
    text: 'err'
  });

  const empty = outputFile({
    in: 'tmp/empty.js',
    out: 'tmp/empty.html',
    text: ''
  });

  await Promise.all([
    fsp.mkdir(path.parse(page.file.path).dir, { recursive: true }),
    fsp.mkdir(path.parse(stylesheet.base.file.path).dir, { recursive: true }),
    fsp.mkdir(path.parse(stylesheet.nested.file.path).dir, { recursive: true }),
    fsp.mkdir(path.parse(json.file.path).dir, { recursive: true }),
    fsp.mkdir(path.parse(error.file.path).dir, { recursive: true }),
    fsp.mkdir(path.parse(empty.file.path).dir, { recursive: true })
  ]);

  await Promise.all([
    fsp.writeFile(page.file.path, page.file.text),
    fsp.writeFile(stylesheet.base.file.path, stylesheet.base.file.text),
    fsp.writeFile(stylesheet.nested.file.path, stylesheet.nested.file.text),
    fsp.writeFile(json.file.path, json.file.text),
    fsp.writeFile(error.file.path, error.file.text),
    fsp.writeFile(empty.file.path, empty.file.text)
  ]);

  return {
    root,
    page,
    json,
    error,
    empty,
    stylesheet,
    cleanup: () => fsp.rm(root, { recursive: true, force: true })
  };
};

