import { useEffect, useState } from 'react';

export const useTypewriter = (texts, { typingSpeed = 100, deletingSpeed = 50, pause = 2000 } = {}) => {
  const [textIndex, setTextIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setTextIndex(0);
    setTypedText('');
    setIsDeleting(false);
  }, [texts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!texts || texts.length === 0) return undefined;

    const currentText = texts[textIndex];
    if (!currentText) return undefined;

    let timeout;

    if (!isDeleting && typedText.length < currentText.length) {
      timeout = setTimeout(() => {
        setTypedText(currentText.slice(0, typedText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && typedText.length === currentText.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pause);
    } else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(() => {
        setTypedText(currentText.slice(0, typedText.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && typedText.length === 0) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [texts, textIndex, typedText, isDeleting, typingSpeed, deletingSpeed, pause]);

  return { typedText, showCursor };
};
