import { User, Globe, Database } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const AboutSection = ({ stats }) => {
  const { t } = useLanguage();

  const codeBlock = t('about.codeBlock')
    .replace('{repos}', stats.publicRepos)
    .replace('{stars}', stats.totalStars);

  return (
    <section id="sobre" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          <User className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8" size={32} />
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            <span className="text-gray-900 dark:bg-gradient-to-r dark:from-purple-500 dark:to-pink-500 dark:bg-clip-text dark:text-transparent">{t('about.title')}</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="space-y-4 sm:space-y-5">
            <div className="card-motion transform bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30">
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-2 sm:mb-3">
                {t('about.card1.text')}
              </p>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-2 sm:mb-3">
                {t('about.card2.text')}
              </p>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {t('about.card3.text')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="card-motion transform bg-gradient-to-br from-purple-500/20 to-transparent backdrop-blur-xl border border-purple-500/30 p-4 sm:p-6 rounded-xl hover:scale-105 text-center">
                <Globe className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                <p className="font-bold text-base sm:text-xl">{t('about.global')}</p>
                <p className="text-gray-400 text-xs sm:text-sm">{t('about.remote')}</p>
              </div>
              <div className="card-motion transform bg-gradient-to-br from-pink-500/20 to-transparent backdrop-blur-xl border border-pink-500/30 p-4 sm:p-6 rounded-xl hover:scale-105 text-center">
                <Database className="text-pink-500 w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                <p className="font-bold text-base sm:text-xl">{t('about.fullstack')}</p>
                <p className="text-gray-400 text-xs sm:text-sm">{t('about.frontback')}</p>
              </div>
            </div>
          </div>

          <div className="card-motion transform bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl sm:rounded-2xl overflow-hidden hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/30">
            <div className="flex gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
            </div>
            <pre className="p-4 sm:p-6 text-purple-400 font-mono text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap">
{codeBlock}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
