import test from 'node:test';
import assert from 'node:assert/strict';
import { createPickTracker } from './picking.ts';
const ev = (type: string, pointerId: number, clientX: number, clientY: number, timeStamp: number, isPrimary = true) => ({ type, pointerId, clientX, clientY, timeStamp, isPrimary, button: 0 });
test('a short still tap picks; a drag, a long press and a cancelled swipe do not', () => {
  const t = createPickTracker();
  t.down(ev('pointerdown', 1, 10, 10, 0)); assert.equal(t.end(ev('pointerup', 1, 13, 12, 120)), true);
  t.down(ev('pointerdown', 1, 10, 10, 0)); assert.equal(t.end(ev('pointerup', 1, 40, 10, 120)), false);
  t.down(ev('pointerdown', 1, 10, 10, 0)); assert.equal(t.end(ev('pointerup', 1, 10, 10, 900)), false);
  t.down(ev('pointerdown', 1, 10, 10, 0)); assert.equal(t.end(ev('pointercancel', 1, 10, 10, 50)), false);
  assert.equal(t.end(ev('pointerup', 7, 0, 0, 10)), false);
});
test('a pinch never picks, even when the first finger lifts without moving', () => {
  const t = createPickTracker();
  t.down(ev('pointerdown', 1, 10, 10, 0)); t.down(ev('pointerdown', 2, 80, 80, 10, false));
  assert.equal(t.end(ev('pointerup', 1, 10, 10, 100)), false);
  assert.equal(t.end(ev('pointerup', 2, 60, 60, 110, false)), false);
  t.down(ev('pointerdown', 3, 10, 10, 200)); assert.equal(t.end(ev('pointerup', 3, 10, 10, 260)), true);
});
