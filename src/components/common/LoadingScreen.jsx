import { useState, useEffect } from 'react';
import { Terminal, Code, Zap } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const LoadingScreen = ({ onLoadingComplete }) => {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const messages = [
    t('loading.init'),
    t('loading.projects'),
    t('loading.github'),
    t('loading.experience'),
    t('loading.almost'),
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = 1.5;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    setTimeout(() => setShowText(true), 300);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    const messageIndex = Math.min(
      Math.floor((progress / 100) * messages.length),
      messages.length - 1
    );
    setLoadingText(messages[messageIndex]);

    if (progress >= 100 && !hasCompleted) {
      setHasCompleted(true);
      setIsExiting(true);
      onLoadingComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, onLoadingComplete, hasCompleted]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: `rgba(168, 85, 247, ${Math.random() * 0.6 + 0.2})`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 max-w-md w-full">
        <div
          className={`mb-8 transform transition-all duration-1000 ${
            showText ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-purple-500/20 animate-ping" style={{ animationDuration: '2s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-pink-500/15 animate-ping animation-delay-500" style={{ animationDuration: '2s' }} />
            </div>

            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-gradient">
              <Terminal className="w-16 h-16 text-white animate-pulse" />
            </div>

            <div className="absolute inset-0 animate-spin-slow">
              <Code
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400"
                size={20}
              />
            </div>
            <div className="absolute inset-0 animate-spin-slow animation-delay-1000">
              <Zap
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-pink-400"
                size={20}
              />
            </div>
          </div>
        </div>

        <div
          className={`text-center mb-8 transition-all duration-700 ${
            showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2 animate-gradient pb-1">
            @higorxyz
          </h2>
          <p className="text-gray-400 text-sm font-mono animate-pulse">
            {loadingText}
          </p>
        </div>

        <div
          className={`w-full transition-all duration-700 ${
            showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="relative w-full h-2 bg-black/50 rounded-full overflow-hidden border border-purple-500/30 backdrop-blur-xl">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full transition-all duration-100 ease-linear relative overflow-hidden bg-[length:200%_100%] animate-gradient"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>

            {progress > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg shadow-purple-500/50"
                style={{ left: `${Math.max(progress - 2, 0)}%` }}
              />
            )}
          </div>

          <div className="flex justify-between items-center mt-2 text-xs">
            <span className="text-purple-400 font-mono">{Math.floor(progress)}%</span>
            <span className="text-gray-500 font-mono">{t('loading.loading')}</span>
          </div>
        </div>

        <div
          className={`mt-8 text-xs text-gray-600 font-mono transition-all duration-1000 delay-500 ${
            showText ? 'opacity-100' : 'opacity-0'
          }`}
        >
          v2.0.0 • {t('loading.version')}
        </div>
      </div>
    </div>
  );
};
