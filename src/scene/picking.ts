type PointerLike = Pick<PointerEvent, 'pointerId' | 'clientX' | 'clientY' | 'timeStamp' | 'isPrimary' | 'button' | 'type'>;

/**
 * Tells a deliberate pick from an orbit drag, a pinch or a scroll swipe: one primary pointer,
 * released within 6 px and 600 ms of where it went down. Cancelled pointers never pick.
 */
export function createPickTracker(maxMove = 6, maxTime = 600) {
  const pointers = new Map<number, { x: number; y: number; time: number }>();
  let multiTouch = false;
  return {
    down(event: PointerLike) {
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, time: event.timeStamp });
      if (pointers.size > 1) multiTouch = true;
    },
    /** Call on pointerup and pointercancel; true only for a pick. */
    end(event: PointerLike) {
      const start = pointers.get(event.pointerId), wasMulti = multiTouch;
      pointers.delete(event.pointerId); if (!pointers.size) multiTouch = false;
      return Boolean(start) && !wasMulti && event.isPrimary && event.button === 0 && event.type === 'pointerup'
        && Math.hypot(event.clientX - start!.x, event.clientY - start!.y) <= maxMove && event.timeStamp - start!.time < maxTime;
    },
  };
}
