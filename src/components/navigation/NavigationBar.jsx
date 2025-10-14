import { useState } from 'react';
import { Menu, X, Terminal, Download } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { ThemeToggle, LanguageToggle } from '.';

const SECTION_KEYS = ['home', 'sobre', 'projetos', 'skills', 'contato'];
const TRANSLATION_KEYS = {
  home: 'home',
  sobre: 'about',
  projetos: 'projects',
  skills: 'skills',
  contato: 'contact'
};

export const NavigationBar = ({ activeSection, onNavigate, onDownloadCV }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (section) => {
    onNavigate(section);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full backdrop-blur-xl z-50 border-b ${
      theme === 'dark' ? 'bg-black/40 border-purple-500/30' : 'bg-white/40 border-purple-300/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="text-purple-500 w-5 h-5 sm:w-6 sm:h-6" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              @higorxyz
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {SECTION_KEYS.map((section) => (
              <button
                key={section}
                onClick={() => handleNavigate(section)}
                className={`capitalize relative transition-colors text-sm lg:text-base ${
                  activeSection === section ? 'text-purple-500' : 'hover:text-purple-500'
                }`}
              >
                {t(`nav.${TRANSLATION_KEYS[section] || section}`)}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-purple-500 transition-all ${
                    activeSection === section ? 'w-full' : 'w-0'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={onDownloadCV}
              className="px-3 lg:px-4 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 font-medium text-xs lg:text-sm flex items-center gap-1.5 hover:scale-105 transition-all"
            >
              <Download size={14} className="lg:w-4 lg:h-4" /> {t('about.downloadCV')}
            </button>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <LanguageToggle />
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen((prev) => !prev)} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-3 animate-fadeIn">
            {SECTION_KEYS.map((section) => (
              <button
                key={section}
                onClick={() => handleNavigate(section)}
                className={`capitalize text-left py-2 px-2 rounded-lg transition-colors ${
                  activeSection === section
                    ? 'text-purple-500 bg-purple-500/10'
                    : 'hover:text-purple-500 hover:bg-purple-500/5'
                }`}
              >
                {t(`nav.${TRANSLATION_KEYS[section] || section}`)}
              </button>
            ))}
            <button
              onClick={() => {
                onDownloadCV();
                setIsMenuOpen(false);
              }}
              className="mt-2 px-4 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 font-medium text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Download size={16} /> {t('about.downloadCV')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
