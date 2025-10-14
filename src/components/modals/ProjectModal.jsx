import { useState, useEffect } from 'react';
import { X, Github, ExternalLink, Star, GitFork, Eye, Calendar, Code, FileText } from 'lucide-react';
import Portal from '../common/Portal';
import { ReadmeViewer } from './ReadmeViewer';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export const ProjectModal = ({ project, isOpen, onClose }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDarkMode = theme === 'dark';
  const [readme, setReadme] = useState(null);
  const [loadingReadme, setLoadingReadme] = useState(false);
  const [readmeNotFound, setReadmeNotFound] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
      }, 150);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setReadme(null);
    setLoadingReadme(false);
    setReadmeNotFound(false);
  }, [project?.id]);

  useEffect(() => {
    const fetchReadme = async () => {
      if (isOpen && project?.repoName) {
        setLoadingReadme(true);
        try {
          const headers = {
            Accept: 'application/vnd.github.v3.html'
          };
          
          const token = import.meta.env.VITE_GITHUB_TOKEN;
          if (token && token !== 'your_github_token_here') {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await fetch(
            `https://api.github.com/repos/higorxyz/${project.repoName}/readme`,
            { headers }
          );

          if (response.ok) {
            const html = await response.text();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const text = tempDiv.textContent || tempDiv.innerText || '';
            setReadme(text);
            setReadmeNotFound(false);
          } else {
            setReadmeNotFound(true);
          }
        } catch (error) {
          console.error('Erro ao buscar README:', error);
          setReadmeNotFound(true);
        } finally {
          setLoadingReadme(false);
        }
      }
    };

    fetchReadme();
  }, [isOpen, project?.repoName]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <Portal>
      <div 
        className={`fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 md:p-8 backdrop-blur-[2px] animate-fadeIn ${
          isDarkMode ? 'bg-black/80' : 'bg-purple-900/20'
        }`}
        onClick={onClose}
      >
        <div 
          className={`
            relative w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh]
            backdrop-blur-xl 
            border-2 
            rounded-2xl sm:rounded-3xl 
            shadow-2xl 
            overflow-hidden
            animate-scaleIn
            ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900/30 to-pink-900/20 border-purple-500/50 shadow-purple-500/40' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-500 shadow-purple-500/40'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header do Modal */}
          <div className={`sticky top-0 z-10 backdrop-blur-xl border-b-2 p-4 sm:p-6 md:p-8 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/30 border-purple-500/40' 
              : 'bg-gradient-to-r from-purple-800/85 to-pink-800/65 border-purple-800'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-900/50'}`}>
                  <Code className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${isDarkMode ? 'text-purple-400' : 'text-white'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1 text-white truncate">
                    {project.title}
                  </h3>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-purple-50'}`}>
                    {t('modal.projectDetails')}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`
                  p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0
                  transition-all duration-200
                  hover:scale-110
                  border
                  ${isDarkMode 
                    ? 'bg-purple-500/20 hover:bg-red-500/30 text-purple-300 hover:text-red-300 border-purple-500/30 hover:border-red-500/50' 
                    : 'bg-white/25 hover:bg-red-600/60 text-white hover:text-red-50 border-white/40 hover:border-red-600/80'
                  }
                `}
                title="Fechar (ESC)"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Conteúdo do Modal */}
          <div className={`overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-120px)] p-3 sm:p-6 md:p-8 ${isDarkMode ? 'bg-gradient-to-b from-transparent via-purple-950/20 to-purple-950/30' : 'bg-gradient-to-b from-transparent to-purple-50/50'}`}>
            
            {/* Preview AO VIVO do Site */}
            {project.demo && (
              <div className="mb-4 sm:mb-6 flex justify-center">
                <div className={`rounded-xl sm:rounded-2xl overflow-hidden border-2 shadow-xl w-full max-w-[95%] sm:max-w-[700px] ${
                  isDarkMode ? 'border-purple-500/50 shadow-purple-500/30' : 'border-purple-400 shadow-purple-400/40'
                } ${isMobile ? 'cursor-none' : ''}`}>
                <div className={`p-2 sm:p-3 flex items-center gap-1.5 sm:gap-2 ${
                  isDarkMode ? 'bg-gradient-to-r from-purple-900/60 to-pink-900/40' : 'bg-gradient-to-r from-purple-200 to-pink-200'
                }`}>
                  <div className="flex gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className={`flex-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs truncate ${
                    isDarkMode ? 'bg-black/70 text-purple-200 font-medium' : 'bg-white/80 text-gray-700 font-medium'
                  }`}>
                    {project.demo}
                  </div>
                  <a 
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium transition-colors whitespace-nowrap ${
                      isDarkMode 
                        ? 'bg-purple-600/80 text-white hover:bg-purple-500' 
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    {t('modal.open')} ↗
                  </a>
                </div>
                <div className={`relative w-full h-[300px] sm:h-[500px] overflow-hidden bg-gray-900 flex items-start justify-center ${isMobile ? 'cursor-none' : ''}`} style={isMobile ? { cursor: 'none !important' } : {}}>
                  <iframe
                    src={project.demo}
                    className={isMobile ? 'cursor-none' : 'absolute top-0 left-0'}
                    style={{
                      width: isMobile ? '375px' : '1400px',
                      height: isMobile ? '667px' : '1000px',
                      border: 'none',
                      pointerEvents: 'none',
                      transform: isMobile ? 'scale(1)' : 'scale(0.5)',
                      transformOrigin: isMobile ? 'top center' : '0 0',
                      cursor: isMobile ? 'none' : 'default'
                    }}
                    title={`Preview de ${project.title}`}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    loading="lazy"
                  />
                  {/* Overlay clicável para manter cursor customizado e abrir link */}
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10 cursor-pointer"
                    title="Clique para abrir o site em nova aba"
                  ></a>
                </div>
                </div>
              </div>
            )}

            {/* README Resumido */}
            <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 ${
              isDarkMode ? 'bg-gradient-to-br from-purple-950/50 to-pink-950/30 border-purple-500/30 shadow-lg shadow-purple-500/20' : 'bg-white border-purple-300 shadow-lg shadow-purple-200/50'
            }`}>
              <h4 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 flex items-center gap-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('modal.readme')}
              </h4>
              {loadingReadme ? (
                <p className={`leading-relaxed text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                  {t('modal.loading')}
                </p>
              ) : readmeNotFound ? (
                <p className={`leading-relaxed italic text-sm sm:text-base ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {t('modal.noReadme')}
                </p>
              ) : readme ? (
                <div>
                  <p className={`leading-relaxed text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    {readme.length > 200 ? `${readme.substring(0, 200)}...` : readme}
                  </p>
                  {readme.length > 200 && (
                    <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                      <ReadmeViewer 
                        username="higorxyz"
                        repoName={project.repoName}
                        description={project.description}
                        projectTitle={project.title}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className={`leading-relaxed text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {project.description || 'Projeto desenvolvido no GitHub'}
                </p>
              )}
            </div>

            {/* Estatísticas */}
            <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 ${
              isDarkMode ? 'bg-gradient-to-br from-purple-950/50 to-pink-950/30 border-purple-500/30 shadow-lg shadow-purple-500/20' : 'bg-white border-purple-300 shadow-lg shadow-purple-200/50'
            }`}>
              <h4 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                📊 {t('modal.stats')}
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                  isDarkMode ? 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border-yellow-600/40' : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300'
                }`}>
                  <Star className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <div className="min-w-0">
                    <p className={`text-xs ${isDarkMode ? 'text-yellow-300 font-semibold' : 'text-yellow-800 font-semibold'}`}>{t('modal.stars')}</p>
                    <p className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-yellow-100' : 'text-yellow-900'}`}>
                      {project.stars || 0}
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                  isDarkMode ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-600/40' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300'
                }`}>
                  <GitFork className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div className="min-w-0">
                    <p className={`text-xs ${isDarkMode ? 'text-blue-300 font-semibold' : 'text-blue-800 font-semibold'}`}>{t('modal.forks')}</p>
                    <p className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                      {project.forks || 0}
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                  isDarkMode ? 'bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-600/40' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-300'
                }`}>
                  <Eye className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <div className="min-w-0">
                    <p className={`text-xs ${isDarkMode ? 'text-green-300 font-semibold' : 'text-green-800 font-semibold'}`}>{t('modal.watchers')}</p>
                    <p className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-green-100' : 'text-green-900'}`}>
                      {project.watchers || 0}
                    </p>
                  </div>
                </div>

                {project.language && (
                  <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                    isDarkMode ? 'bg-gradient-to-br from-purple-900/40 to-purple-800/30 border-purple-600/40' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300'
                  }`}>
                    <Code className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    <div className="min-w-0">
                      <p className={`text-xs ${isDarkMode ? 'text-purple-300 font-semibold' : 'text-purple-800 font-semibold'}`}>{t('modal.language')}</p>
                      <p className={`font-bold text-sm sm:text-base truncate ${isDarkMode ? 'text-purple-100' : 'text-purple-900'}`}>
                        {project.language}
                      </p>
                    </div>
                  </div>
                )}

                {project.createdAt && (
                  <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                    isDarkMode ? 'bg-gradient-to-br from-pink-900/30 to-pink-800/20 border-pink-600/40' : 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300'
                  }`}>
                    <Calendar className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                    <div className="min-w-0">
                      <p className={`text-xs ${isDarkMode ? 'text-pink-300 font-semibold' : 'text-pink-800 font-semibold'}`}>{t('modal.created')}</p>
                      <p className={`font-bold text-xs sm:text-sm ${isDarkMode ? 'text-pink-100' : 'text-pink-900'}`}>
                        {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}

                {project.updatedAt && (
                  <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                    isDarkMode ? 'bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-600/40' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300'
                  }`}>
                    <Calendar className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                    <div className="min-w-0">
                      <p className={`text-xs ${isDarkMode ? 'text-orange-300 font-semibold' : 'text-orange-800 font-semibold'}`}>{t('modal.updated')}</p>
                      <p className={`font-bold text-xs sm:text-sm ${isDarkMode ? 'text-orange-100' : 'text-orange-900'}`}>
                        {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tecnologias */}
            {project.tech && project.tech.length > 0 && (
              <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 ${
                isDarkMode ? 'bg-gradient-to-br from-purple-950/50 to-pink-950/30 border-purple-500/30 shadow-lg shadow-purple-500/20' : 'bg-white border-purple-300 shadow-lg shadow-purple-200/50'
              }`}>
                <h4 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                  🛠️ {t('modal.technologies')}
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 border ${
                        isDarkMode 
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 !text-white border-purple-500/50 shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-400/40 hover:scale-105' 
                          : 'bg-gradient-to-br from-purple-600 to-pink-600 !text-white border-purple-700 shadow-md shadow-purple-300/50 hover:shadow-lg hover:shadow-purple-400/50 hover:scale-105'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 ${
              isDarkMode ? 'bg-gradient-to-br from-purple-950/50 to-pink-950/30 border-purple-500/30 shadow-lg shadow-purple-500/20' : 'bg-white border-purple-300 shadow-lg shadow-purple-200/50'
            }`}>
              <h4 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                🔗 {t('modal.links')}
              </h4>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 border-2 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-purple-700 to-purple-800 !text-white border-purple-600 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-400/60 hover:scale-105' 
                        : 'bg-gradient-to-r from-purple-700 to-purple-800 !text-white border-purple-900 shadow-lg shadow-purple-400/50 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" /> {t('modal.viewDemo')}
                  </a>
                )}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 border-2 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 !text-white border-purple-500 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-400/60 hover:scale-105' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 !text-white border-purple-700 shadow-lg shadow-purple-400/50 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105'
                  }`}
                >
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" /> {t('modal.viewGithub')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
