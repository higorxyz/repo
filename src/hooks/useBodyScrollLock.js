import { useEffect } from 'react';

let lockCount = 0;
let previousOverflow;

const setOverflow = (value) => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = value;
};

export const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    if (typeof document === 'undefined' || !isLocked) {
      return undefined;
    }

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
    }

    lockCount += 1;
    setOverflow('hidden');

    return () => {
      lockCount = Math.max(lockCount - 1, 0);
      if (lockCount === 0) {
        setOverflow(previousOverflow || '');
        previousOverflow = undefined;
      }
    };
  }, [isLocked]);
};
