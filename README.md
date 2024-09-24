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

As `spider` transforms `esbuild` output files, [`write`](https://esbuild.github.io/api/#write) is set to `false` and [`metafile`](https://esbuild.github.io/api/#metafile) is set to `true`. CSS imported within pages will be exported to the same location as the page file.

```JS
import esbuild from 'esbuild';
import spider from 'esbuild-plugin-spider';

esbuild.build({
  ...
  plugins: [spider()]
});
```
