import test from 'tape';

import { notNull } from './is';

test('[is.notNull] returns true if not null', t => {
  t.true(notNull(''));

  t.end();
});

test('[is.notNull] returns false if null', t => {
  t.false(notNull(null));

  t.end();
});
