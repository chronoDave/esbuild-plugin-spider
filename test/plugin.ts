import type { Page } from '@chronocide/spider';

import add from './lib';

import './page.css';

add(1, 2);

const page: Page = {
  url: '/esbuild/plugin/spider',
  html: ({ lastModified }) => `${lastModified.getTime()}`
};

export default page;
