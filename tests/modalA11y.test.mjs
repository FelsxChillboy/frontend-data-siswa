import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createModalKeydownHandler } from '../src/utils/modalA11y.js';

const makeEvent = ({ key, currentTarget, target, shiftKey = false }) => ({
  key,
  currentTarget,
  target,
  shiftKey,
  defaultPrevented: false,
  preventDefault() {
    this.defaultPrevented = true;
  },
});

const makeDialog = () => {
  const focused = [];
  const fields = ['first', 'last'].map((name) => ({
    name,
    focus() {
      focused.push(name);
    },
  }));
  const dialog = {
    querySelectorAll: () => fields,
  };
  return { dialog, fields, focused };
};

test('Escape menutup modal', () => {
  const { dialog } = makeDialog();
  let closed = 0;
  const handler = createModalKeydownHandler({ onClose: () => (closed += 1) });
  const event = makeEvent({ key: 'Escape', currentTarget: dialog, target: dialog });

  handler(event);

  assert.equal(closed, 1);
  assert.equal(event.defaultPrevented, true);
});

test('Escape tidak menutup modal saat sedang submit', () => {
  const { dialog } = makeDialog();
  let closed = 0;
  const handler = createModalKeydownHandler({
    onClose: () => (closed += 1),
    disabled: true,
  });

  handler(makeEvent({ key: 'Escape', currentTarget: dialog, target: dialog }));

  assert.equal(closed, 0);
});

test('Tab dari field terakhir kembali ke field pertama', () => {
  const { dialog, fields, focused } = makeDialog();
  const handler = createModalKeydownHandler({ onClose: () => {} });

  handler(
    makeEvent({ key: 'Tab', currentTarget: dialog, target: fields[1] }),
  );

  assert.deepEqual(focused, ['first']);
});

test('Shift+Tab dari field pertama ke field terakhir', () => {
  const { dialog, fields, focused } = makeDialog();
  const handler = createModalKeydownHandler({ onClose: () => {} });

  handler(
    makeEvent({
      key: 'Tab',
      currentTarget: dialog,
      target: fields[0],
      shiftKey: true,
    }),
  );

  assert.deepEqual(focused, ['last']);
});
