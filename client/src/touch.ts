// Shared touch-input state, read by Player (movement) and TouchLook (camera).
// A plain mutable object keeps the hot path allocation-free.
export const touch = {
  mx: 0,      // strafe  -1 (left) .. +1 (right)
  my: 0,      // forward -1 (up/forward) .. +1 (back)
  lookDX: 0,  // accumulated look delta x (consumed each frame)
  lookDY: 0,  // accumulated look delta y
  sprint: false,
};

export const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);
