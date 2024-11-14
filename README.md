<div align="center">
  <h1>@chronocide/esbuild-plugin-spider</h1>
  <p><a href="https://github.com/chronoDave/spider"><code>spider</code></a> plugin for <a href="https://esbuild.github.io/">esbuild</a>.</p>
</div>

<div align="center">
  <a href="/LICENSE">
    <img alt="License AGPLv3" src="https://img.shields.io/badge/license-AGPLv3-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@chronocide/esbuild-plugin-spider">
    <img alt="NPM" src="https://img.shields.io/npm/v/@chronocide/esbuild-plugin-spider?label=npm">
  </a>
  <a href="https://packagephobia.com/result?p=@chronocide/esbuild-plugin-spider">
    <img alt="Bundle size" src="https://packagephobia.com/badge?p=@chronocide/esbuild-plugin-spider">
  </a>
</div>

## Installation

Install using [npm](npmjs.org):

```sh
npm i @chronocide/esbuild-plugin-spider -D
```

## Usage

As `spider` transforms and writes files, the following `esbuild` options will always be overriden:

- [`write`](https://esbuild.github.io/api/#write): As spider sets output locations, write must be disabled
- [`metafile`](https://esbuild.github.io/api/#metafile): Metafile must be enabled to get a reference to the source file
- [`format`](https://esbuild.github.io/api/#format): Spider only supports `esm`
- [`bundle`](https://esbuild.github.io/api/#bundle): Files must be bundled

```JS
import esbuild from 'esbuild';
import spider from '@chronocide/esbuild-plugin-spider';

esbuild.build({
  entryPoints: ['tmp/**/*.ts'],
  outdir: 'dist',
  plugins: [spider()]
});
```
