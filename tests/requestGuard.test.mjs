import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createRequestGuard } from '../src/utils/requestGuard.js';

test('hanya token permintaan terakhir yang dianggap aktif', () => {
  const guard = createRequestGuard();
  const first = guard.next();
  const second = guard.next();

  assert.equal(guard.isCurrent(first), false);
  assert.equal(guard.isCurrent(second), true);
});

test('invalidate membuat semua token lama tidak aktif', () => {
  const guard = createRequestGuard();
  const token = guard.next();

  guard.invalidate();

  assert.equal(guard.isCurrent(token), false);
  assert.equal(guard.isCurrent(guard.next()), true);
});
