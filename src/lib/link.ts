import type { Metafile, OutputFile } from 'esbuild';
import path from 'path';

import fs from 'fs';

export type LinkResult = {
  text: string;
  lastModified: Date;
  css: string | null;
};

export default (outputs: Metafile['outputs'], outputFiles: OutputFile[]): LinkResult[] =>
  Object.entries(outputs).reduce<LinkResult[]>((acc, cur) => {
    if (typeof cur[1].entryPoint !== 'string') return acc;

    const file = outputFiles.find(outputFile => {
      const key = path.normalize(cur[0]);
      return path.normalize(outputFile.path).includes(key);
    });
    if (!file) return acc;

    const { mtime } = fs.statSync(cur[1].entryPoint);
    const css = outputFiles.find(outputFile => {
      const key = typeof cur[1].cssBundle === 'string' ?
        path.normalize(cur[1].cssBundle) :
        null;

      if (typeof key !== 'string') return null;
      return path.normalize(outputFile.path).includes(key);
    })?.text ?? null;

    acc.push({ lastModified: mtime, text: file.text, css });

    return acc;
  }, []);

