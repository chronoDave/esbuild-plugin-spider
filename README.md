<div align="center">
  <h1>@chronocide/esbuild-plugin-spider</h1>
  <p><a href="https://github.com/chronoDave/spider"><code>spider</code></a> plugin for <a href="https://esbuild.github.io/">esbuild</a>.</p>
</div>

<div align="center">
  <a href="/LICENSE">
    <img alt="License GPLv3" src="https://img.shields.io/badge/license-GPLv3-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@chronocide/spider">
    <img alt="NPM" src="https://img.shields.io/npm/v/@chronocide/spider?label=npm">
  </a>
  <a href="https://packagephobia.com/result?p=@chronocide/spider">
    <img alt="Bundle size" src="https://packagephobia.com/badge?p=@chronocide/spider">
  </a>
</div>

## Installation

Install using [npm](npmjs.org):

```sh
npm i @chronocide/esbuild-plugin-spider -D
```

## Usage

As `spider` transforms `esbuild` output files, `write` is set to [`false`](https://esbuild.github.io/api/#write). Files imported within page files are not written by default and are handled by the [`assets`](#assets) option.

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

By default, all non-page files will be ignored. `filter` will come before `assets`, so make sure to use `filter` if importing `js` files.

```TS
import esbuild from 'esbuild';
import spider from 'esbuild-plugin-spider';

esbuild.build({
  ...
  plugins: [spider({
    outdir: 'dist',
    assets: [
      { filter: /\.css$/ }, // src/index.css => dist/index.css
      { filter: /\.woff$/, path: 'fonts' } // src/assets/font.woff => dist/fonts/assets/font.woff
    ]
  })]
});
```
