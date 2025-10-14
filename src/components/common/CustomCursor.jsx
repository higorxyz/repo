import { useEffect, useRef, useState } from 'react';

const CLICKABLE_SELECTORS = [
  'a',
  'button',
  '[role="button"]',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  'label[for]',
  '.cursor-pointer'
];

export const CustomCursor = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
  const frameRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(pointer: fine)');

    const updatePointerCapability = (event) => {
      setIsEnabled(event.matches);
    };

    updatePointerCapability(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updatePointerCapability);
    } else {
      mediaQuery.addListener(updatePointerCapability);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updatePointerCapability);
      } else {
        mediaQuery.removeListener(updatePointerCapability);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    if (!isEnabled) {
      document.body.classList.remove('custom-cursor-active');
      setIsVisible(false);
      return undefined;
    }

    document.body.classList.add('custom-cursor-active');

    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') {
      return undefined;
    }

    const handleMouseMove = (event) => {
      const { clientX, clientY, target } = event;

      const isElementConstructorAvailable = typeof Element !== 'undefined';
      const resolveTarget = isElementConstructorAvailable && target instanceof Element
        ? target
        : document.elementFromPoint(clientX, clientY);

      const hoveringClickable = Boolean(
        resolveTarget && CLICKABLE_SELECTORS.some((selector) => resolveTarget.closest(selector))
      );

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        setPosition({ x: clientX, y: clientY });
        setIsClickable(hoveringClickable);
        setIsVisible(true);
      });
    };

    const handleMouseLeaveWindow = (event) => {
      if (!event.relatedTarget && !event.toElement) {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseout', handleMouseLeaveWindow);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeaveWindow);
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  const cursorStyle = {
    position: 'fixed',
    top: `${position.y}px`,
    left: `${position.x}px`,
    width: '8px',
    height: '8px',
    borderRadius: '9999px',
    pointerEvents: 'none',
    background: isClickable ? '#ec4899' : '#a855f7',
    boxShadow: isClickable
      ? '0 0 12px rgba(236, 72, 153, 0.6)'
      : '0 0 10px rgba(168, 85, 247, 0.55)',
    transform: `translate(-50%, -50%) scale(${isClickable ? 1.7 : 1})`,
    opacity: isVisible ? 1 : 0,
    transition: 'transform 120ms ease, background 160ms ease, opacity 120ms ease',
    zIndex: 2147483647
  };

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          body.custom-cursor-active,
          body.custom-cursor-active * {
            cursor: none !important;
          }
        }
      `}</style>
      <div style={cursorStyle} />
    </>
  );
};
