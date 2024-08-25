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

As `spider` transforms `esbuild` output files, `write` is set to [`false`](https://esbuild.github.io/api/#write). Files imported within pages will be exported to the same location as the page files by default.

```JS
import esbuild from 'esbuild';
import spider from 'esbuild-plugin-spider';

esbuild.build({
  ...
  plugins: [spider()]
});
```

### Options

| Option | Type | Default
| - | - | - |
| `filter` | `RegExp` | `null` |
| `assets` | `Asset[]` | `[]` |

```TS
type Asset = {
  filter: RegExp;
  path: string;
}
```

#### `filter`

By default, `esbuild-plugin-spider` treats `.js` files as page files. This can be overwritten with the `filter` option.

```TS
import esbuild from 'esbuild';
import spider from 'esbuild-plugin-spider';

esbuild.build({
  ...
  plugins: [spider({
    filter: /\.page\.js$/
  })]
});
```

#### `assets`

By default, all imported asset files will be written to the same directory as the page files. `filter` can be used to change the root directory (relative to the output directory) of specific asset files.

`filter` will come before `assets`, so make sure to use `filter` if importing `js` files.

```TS
import esbuild from 'esbuild';
import spider from 'esbuild-plugin-spider';

esbuild.build({
  ...
  plugins: [spider({
    outdir: 'dist',
    assets: [
      /**
       * Url:     / 
       * Asset:   src/index.css
       * Out:     dist/css/index.css
       */
      { filter: /\.css$/, path: 'css' },
      /**
       *  Url:    /about
       *  Asset:  src/scss/pages/about.css
       *  Out:    dist/css/about/about.css
       */
      { filter: /\.css$/, path: 'css' }
    ]
  })]
});
```
