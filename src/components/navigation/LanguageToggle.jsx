import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { Globe, Check } from 'lucide-react';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isDark = theme === 'dark';

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const languages = [
    { code: 'pt', label: 'PT', fullName: 'Português' },
    { code: 'en', label: 'EN', fullName: 'English' }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:scale-105 ${
          isDark
            ? 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30'
            : 'bg-purple-100 hover:bg-purple-200 border-purple-300'
        }`}
        aria-label="Select language"
      >
        <Globe size={14} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
        <span className={`text-sm font-semibold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
          {language.toUpperCase()}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full mt-2 right-0 w-36 backdrop-blur-xl border rounded-lg shadow-2xl overflow-hidden z-50 animate-fadeIn ${
          isDark
            ? 'bg-black/95 border-purple-500/30 shadow-purple-500/20'
            : 'bg-white border-purple-300 shadow-purple-200/50'
        }`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                language === lang.code
                  ? isDark
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-purple-100 text-purple-700'
                  : isDark
                    ? 'text-gray-300 hover:bg-purple-500/10 hover:text-purple-400'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{lang.label}</span>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {lang.fullName}
                </span>
              </div>
              {language === lang.code && (
                <Check size={16} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;

