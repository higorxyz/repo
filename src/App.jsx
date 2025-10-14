import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Github, Linkedin, Instagram, ArrowUp } from 'lucide-react';
import { useGitHubData } from './hooks/useGitHubData';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
import {
  HeroSection,
  StatsSection,
  AboutSection,
  ProjectsSection,
  SkillsSection,
  ContactSection
} from './components/sections';
import { NavigationBar } from './components/navigation';
import { LoadingScreen, CustomCursor } from './components/common';
import { ProjectModal } from './components/modals';
import { CV_CONFIG } from './config';
import { useParticleBackground } from './hooks/useParticleBackground';

function App() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  const canvasRef = useRef(null);
  useParticleBackground(canvasRef, theme);

  const username = 'higorxyz';
  const { repos: githubRepos, stats, languages, loading, error } = useGitHubData(username);

  const projects = useMemo(() => {
    if (loading || githubRepos.length === 0) {
      return [
        {
          title: 'Carregando...',
          description: 'Buscando seus projetos do GitHub...',
          tech: ['GitHub', 'API'],
          link: 'https://github.com/higorxyz',
          status: 'loading',
          visits: '---',
          github: 'https://github.com/higorxyz',
          featured: false
        }
      ];
    }
    return githubRepos;
  }, [githubRepos, loading]);

  const skills = useMemo(() => {
    if (loading || languages.length === 0) {
      return [{ name: 'Carregando...', level: 0, category: 'Loading' }];
    }
    return languages;
  }, [languages, loading]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
          setScrollProgress(progress);
          setShowScrollTop(window.scrollY > 500);

          if (!isScrolling) {
            const sections = ['home', 'sobre', 'projetos', 'skills', 'contato'];
            const currentSection = sections.find((section) => {
              const element = document.getElementById(section);
              if (!element) return false;
              const rect = element.getBoundingClientRect();
              return rect.top <= 100 && rect.bottom >= 100;
            });
            if (currentSection) setActiveSection(currentSection);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling]);

  const scrollToSection = useCallback((section) => {
    setActiveSection(section);
    setIsScrolling(true);

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => setIsScrolling(false), 1000);
    } else {
      setIsScrolling(false);
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const downloadCV = useCallback(() => {
    const link = document.createElement('a');
    link.href = `${CV_CONFIG.path}${CV_CONFIG.fileName}`;
    link.download = CV_CONFIG.fileName;
    link.click();
  }, []);

  const handleProjectSelect = useCallback((project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative">
      <CustomCursor />

      <div className={`transition-opacity duration-700 ease-out ${isInitialLoading ? 'opacity-0' : 'opacity-100'}`}>
        {error && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-yellow-500/20 border border-yellow-500 text-yellow-300 px-6 py-3 rounded-lg z-50 backdrop-blur-xl">
             {error}
          </div>
        )}

        <div
          className="fixed top-0 left-0 h-1 z-[100]"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(to right, #a855f7, #ec4899)',
            boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)'
          }}
        />

        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
          style={{ position: 'fixed' }}
        />

        <div className="relative z-10 overflow-x-hidden max-w-full">
          <NavigationBar
            activeSection={activeSection}
            onNavigate={scrollToSection}
            onDownloadCV={downloadCV}
          />

          <main>
            <HeroSection onNavigate={scrollToSection} />
            <StatsSection stats={stats} loading={loading} />
            <AboutSection stats={stats} />
            <ProjectsSection
              projects={projects}
              loading={loading}
              onSelectProject={handleProjectSelect}
              username={username}
            />
            <SkillsSection skills={skills} loading={loading} />
            <ContactSection />
          </main>

          <footer className="border-t border-purple-500/30 py-6 sm:py-8 px-4 sm:px-6 text-center">
            <div className="max-w-7xl mx-auto">
              <p className="text-gray-400 mb-2 text-sm sm:text-base">
                {t('footer.made')}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
                &copy; {new Date().getFullYear()} Higor Batista. {t('footer.rights')}
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-4 text-gray-500 text-xs sm:text-sm flex-wrap">
                <span>{t('footer.version')} 2.0</span>
                <span></span>
                <span className="text-purple-400">{t('loading.version')}</span>
              </div>
            </div>
          </footer>

          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 hover:scale-110 hover:-translate-y-2 z-50"
            >
              <ArrowUp size={20} className="sm:w-6 sm:h-6" />
            </button>
          )}

          <div className="hidden sm:flex fixed bottom-6 sm:bottom-8 left-6 sm:left-8 flex-col gap-3 sm:gap-4 z-50">
            <a
              href="https://github.com/higorxyz"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/50 hover:scale-110 transition-transform"
            >
              <Github size={18} className="sm:w-5 sm:h-5 text-white" />
            </a>
            <a
              href="https://www.linkedin.com/in/higorbatista"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/50 hover:scale-110 transition-transform"
            >
              <Linkedin size={18} className="sm:w-5 sm:h-5 text-white" />
            </a>
            <a
              href="https://www.instagram.com/higorxyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-xl shadow-pink-500/50 hover:scale-110 transition-transform"
            >
              <Instagram size={18} className="sm:w-5 sm:h-5 text-white" />
            </a>
          </div>
        </div>
      </div>

      {isInitialLoading && (
        <LoadingScreen onLoadingComplete={() => setIsInitialLoading(false)} />
      )}

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default App;
