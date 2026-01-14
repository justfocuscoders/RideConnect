// src/utils/mode.js

const MODE_KEY = "rc_active_mode";

export const MODES = {
  PASSENGER: "passenger",
  DRIVER: "driver",
};

/**
 * Get stored mode (defaults to passenger)
 */
export const getActiveMode = () => {
  const mode = localStorage.getItem(MODE_KEY);
  return mode === MODES.DRIVER ? MODES.DRIVER : MODES.PASSENGER;
};

/**
 * Persist selected mode
 */
export const setActiveMode = (mode) => {
  if (mode === MODES.DRIVER || mode === MODES.PASSENGER) {
    localStorage.setItem(MODE_KEY, mode);
  }
};

/**
 * Force passenger mode (used for invalid states)
 */
export const forcePassengerMode = () => {
  localStorage.setItem(MODE_KEY, MODES.PASSENGER);
};
