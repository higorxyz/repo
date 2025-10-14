import { Code } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { SkillCardSkeleton } from '../ui';

export const SkillsSection = ({ skills, loading }) => {
  const { t } = useLanguage();

  return (
    <section id="skills" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          <Code className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8" size={32} />
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            <span className="text-gray-900 dark:bg-gradient-to-r dark:from-purple-500 dark:to-pink-500 dark:bg-clip-text dark:text-transparent">{t('skills.title')}</span>
          </h3>
        </div>
        <p className="text-center text-gray-400 mb-6 sm:mb-10 text-sm sm:text-base px-4">
          {t('skills.subtitle')}
          {!loading && <span className="text-purple-400 font-semibold"> {t('skills.basedOn')}</span>}
        </p>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {[...Array(6)].map((_, index) => (
              <SkillCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {skills.map((skill, index) => {
              const SkillIcon = skill.icon || Code;
              return (
                <div
                  key={`${skill.name}-${index}`}
                  className="card-motion bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:scale-105 hover:-translate-y-2 shadow-subtle-lg hover:shadow-subtle-2xl"
                >
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <SkillIcon size={32} className="text-purple-300 sm:w-8 sm:h-8 w-7 h-7" />
                      <div>
                        <span className="font-bold text-base sm:text-lg block">{skill.name}</span>
                        <span className="text-gray-400 text-xs">{skill.category}</span>
                      </div>
                    </div>
                    <span className="text-purple-400 font-bold text-base sm:text-lg">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2.5 sm:h-3 overflow-hidden border border-purple-500/30">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full shadow-lg shadow-purple-500/50"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
