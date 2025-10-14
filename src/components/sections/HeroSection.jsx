import { useMemo } from 'react';
import { Cpu, Rocket, Mail, Github, Linkedin, Instagram, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useTypewriter } from '../../hooks/useTypewriter';

export const HeroSection = ({ onNavigate }) => {
  const { t } = useLanguage();
  const texts = useMemo(() => [t('hero.role1'), t('hero.role2')], [t]);
  const { typedText, showCursor } = useTypewriter(texts);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-5xl mx-auto text-center w-full">
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto mb-6 sm:mb-8">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500 flex items-center justify-center shadow-subtle-xl">
            <Cpu className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20" />
          </div>
        </div>

        <div className="text-purple-500 font-mono mb-4 sm:mb-6 text-sm sm:text-base">
          console.log("Hello World! 👋")
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent leading-tight px-4 pb-1 overflow-visible">
          {typedText}
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
        </h2>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
          {t('hero.description')}
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mb-8 sm:mb-10 px-4">
          <button
            onClick={() => onNavigate('projetos')}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-subtle-lg"
          >
            <Rocket size={18} /> {t('hero.viewProjects')}
          </button>
          <button
            onClick={() => onNavigate('contato')}
            className="w-full sm:w-auto card-motion transform px-6 py-3 rounded-full border-2 border-purple-500 bg-transparent font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:scale-105 hover:bg-purple-500/20"
          >
            <Mail size={18} /> {t('hero.contact')}
          </button>
        </div>

        <div className="flex gap-3 sm:gap-4 justify-center mb-10 sm:mb-12 px-4">
          <a
            href="https://github.com/higorxyz"
            target="_blank"
            rel="noopener noreferrer"
            className="card-motion transform w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:bg-purple-500/40 hover:-translate-y-2 shadow-lg"
          >
            <Github size={20} className="sm:w-6 sm:h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/higorbatista"
            target="_blank"
            rel="noopener noreferrer"
            className="card-motion transform w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:bg-purple-500/40 hover:-translate-y-2 shadow-lg"
          >
            <Linkedin size={20} className="sm:w-6 sm:h-6" />
          </a>
          <a
            href="https://www.instagram.com/higorxyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="card-motion transform w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:bg-purple-500/40 hover:-translate-y-2 shadow-lg"
          >
            <Instagram size={20} className="sm:w-6 sm:h-6" />
          </a>
          <a
            href="mailto:dev.higorxyz@gmail.com"
            className="card-motion transform w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:bg-purple-500/40 hover:-translate-y-2 shadow-lg"
          >
            <Mail size={20} className="sm:w-6 sm:h-6" />
          </a>
        </div>

        <ChevronDown
          className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 mx-auto animate-bounce cursor-pointer"
          onClick={() => onNavigate('sobre')}
        />
      </div>
    </section>
  );
};
