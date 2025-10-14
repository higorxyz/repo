import { useState, useEffect } from 'react';
import { FileText, Loader, X } from 'lucide-react';
import Portal from '../common/Portal';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export const ReadmeViewer = ({ username, repoName, description, projectTitle }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDarkMode = theme === 'dark';
  const [readme, setReadme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useBodyScrollLock(isModalOpen);

  // Resetar README quando mudar de repositório
  useEffect(() => {
    setReadme(null);
    setError(false);
  }, [username, repoName]);

  const fetchReadme = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/readme`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          }
        }
      );

      if (!response.ok) {
        throw new Error('README não encontrado');
      }

      const html = await response.text();
      
      // Processar HTML para remover links âncora
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Remove todos os links âncora (#) e localhost
      const links = tempDiv.querySelectorAll('a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('#') || href.startsWith('http://localhost'))) {
          // Remove o link mas mantém o texto
          const textNode = document.createTextNode(link.textContent);
          link.parentNode.replaceChild(textNode, link);
        } else if (href && href.startsWith('http')) {
          // Links externos mantém mas força abrir em nova aba
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
      
      setReadme(tempDiv.innerHTML);
      setError(false);
    } catch (err) {
      console.error('Erro ao buscar README:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    if (!readme && !error && repoName) {
      fetchReadme();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Prevenir scroll do body quando modal aberto
  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isModalOpen]);

  // Se não tem repoName, mostra apenas a descrição
  if (!repoName) {
    return <p className="text-gray-400 text-sm">{description}</p>;
  }

  return (
    <>
      <div className="space-y-2">
        {/* Descrição curta sempre visível */}
        {description && description !== 'Projeto desenvolvido no GitHub' && (
          <p className="text-gray-400 text-sm">{description}</p>
        )}

        {/* Botão para abrir modal do README */}
        <button
          onClick={handleOpenModal}
          className="
            flex items-center gap-2 text-sm
            text-purple-400 hover:text-purple-300
            transition-colors duration-200
          "
        >
          <FileText className="w-4 h-4" />
          <span>{t('readme.viewFull')}</span>
        </button>
      </div>

      {/* Modal - Renderizado no body via Portal */}
      {isModalOpen && (
        <Portal>
          <div 
            className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-8 backdrop-blur-[2px] animate-fadeIn ${
              isDarkMode ? 'bg-black/70' : 'bg-white/75'
            }`}
            onClick={handleCloseModal}
          >
            <div 
              className={`
                relative w-full h-full max-w-6xl
                backdrop-blur-xl 
                border-2 
                rounded-3xl 
                shadow-2xl 
                overflow-hidden
                animate-scaleIn
                ${isDarkMode ? 'bg-black/80 border-purple-500/40 shadow-purple-500/30' : 'bg-white border-purple-400 shadow-purple-400/30'}
              `}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header do Modal */}
            <div className={`sticky top-0 z-10 backdrop-blur-xl border-b-2 p-6 sm:p-8 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/30 border-purple-500/40' 
                : 'bg-gradient-to-r from-purple-800/85 to-pink-800/65 border-purple-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-900/50'}`}>
                    <FileText className={`w-7 h-7 ${isDarkMode ? 'text-purple-400' : 'text-white'}`} />
                  </div>
                  <div>
                    <h3 className={`text-2xl sm:text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-white'}`}>
                      {projectTitle || 'README'}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-purple-50'}`}>{t('readme.title')}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className={`
                    p-3 rounded-xl
                    transition-all duration-200
                    hover:scale-110
                    border
                    ${isDarkMode 
                      ? 'bg-purple-500/20 hover:bg-red-500/30 text-purple-300 hover:text-red-300 border-purple-500/30 hover:border-red-500/50' 
                      : 'bg-white/25 hover:bg-red-600/60 text-white hover:text-red-50 border-white/40 hover:border-red-600/80'
                    }
                  `}
                  title={t('readme.close')}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className={`overflow-y-auto h-[calc(100%-120px)] p-6 sm:p-8 ${isDarkMode ? 'bg-transparent' : 'bg-gray-50'}`}>
              {loading && (
                <div className={`flex flex-col items-center justify-center gap-4 py-32 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                  <Loader className={`w-12 h-12 animate-spin ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className="text-lg">{t('readme.loading')}</span>
                </div>
              )}

              {error && !loading && (
                <div className="text-center py-32">
                  <div className={`inline-block p-6 rounded-2xl border ${
                    isDarkMode 
                      ? 'bg-yellow-500/10 border-yellow-500/30' 
                      : 'bg-yellow-400/30 border-yellow-500/50'
                  }`}>
                    <p className={`text-2xl mb-3 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                      ⚠️ {t('readme.notAvailable')}
                    </p>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-800'}>
                      {t('readme.noFile')}
                    </p>
                  </div>
                </div>
              )}

              {readme && !loading && (
                <div className={`rounded-2xl p-6 sm:p-8 border ${
                  isDarkMode 
                    ? 'bg-black/30 border-purple-500/20' 
                    : 'bg-white border-purple-400/40'
                }`}>
                  <div 
                    className={`readme-content prose max-w-none ${isDarkMode ? 'dark-theme' : ''}`}
                    dangerouslySetInnerHTML={{ __html: readme }}
                  />
                </div>
              )}
            </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};
