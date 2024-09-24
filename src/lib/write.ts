import type { TransformResult } from './transform';

import fsp from 'fs/promises';
import path from 'path';

export default (root: string) => async (file: TransformResult): Promise<void> => {
  const { dir, name, base } = path.parse(file.path);

  await fsp.mkdir(path.join(root, dir), { recursive: true });
  await fsp.writeFile(path.join(root, dir, base), file.html);
  if (typeof file.css === 'string') await fsp.writeFile(path.join(root, dir, `${name}.css`), file.css);
};
