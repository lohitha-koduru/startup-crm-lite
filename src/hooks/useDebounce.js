/**
 * @file useDebounce.js
 * @description Custom React hook that debounces a value by the given delay.
 *
 * Returns the debounced copy of `value`, which only updates after the user
 * has stopped changing `value` for `delay` milliseconds.
 *
 * @template T
 * @param {T} value   - The value to debounce.
 * @param {number} delay - Milliseconds to wait before updating (default 300).
 * @returns {T} The debounced value.
 */

import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of `value` that lags `delay` ms behind updates.
 *
 * @template T
 * @param {T} value
 * @param {number} [delay=300]
 * @returns {T}
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
