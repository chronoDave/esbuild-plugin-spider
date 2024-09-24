import type { LinkResult } from './link';

import { bundle } from '@chronocide/spider';

export type TransformResult = {
  path: string;
  redirects: string[];
  css: string | null;
  html: string;
};

export default async (file: LinkResult): Promise<TransformResult | null> => {  
  const result = await bundle(Buffer.from(file.text), { lastModified: file.lastModified });

  if (!result || typeof result.html !== 'string') return null;
  return {
    path: result.path, // Relative path
    redirects: result.redirects,
    css: file.css,
    html: result.html
  };
};
