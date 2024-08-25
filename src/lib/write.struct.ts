import path from 'path';
import fsp from 'fs/promises';

export default async () => {
  const root = path.join(process.cwd(), 'tmp');
  const page = {
    contents: Buffer.from('export default { url: "/", html: "" };'),
    hash: '',
    text: 'export default { url: "/", html: "" };',
    path: path.join(root, 'src/index.js'),
    out: path.join(root, 'index.html')
  };

  const stylesheet = {
    nested: {
      contents: new Uint8Array(),
      hash: '',
      text: 'body {}',
      path: path.join(root, 'about/index.css'),
      out: path.join(root, 'css/about/index.css')
    },
    root: {
      contents: new Uint8Array(),
      hash: '',
      text: 'body {}',
      path: path.join(root, 'index.css'),
      out: path.join(root, 'index.css')
    }
  };

  await fsp.mkdir(root, { recursive: true });

  return {
    root,
    page,
    stylesheet,
    cleanup: () => fsp.rm(root, { recursive: true, force: true })
  };
};

