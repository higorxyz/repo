import { Rocket, Star, GitFork, Award } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useCounter } from '../../hooks/useCounter';
import { StatCardSkeleton } from '../ui';

export const StatsSection = ({ stats, loading }) => {
  const { t } = useLanguage();
  const [statsRef, statsVisible] = useIntersectionObserver();

  const projectsCount = useCounter(stats.publicRepos, 2000, statsVisible && !loading);
  const starsCount = useCounter(stats.totalStars, 2000, statsVisible && !loading);
  const forksCount = useCounter(stats.totalForks, 2000, statsVisible && !loading);

  const achievements = [
    { icon: <Rocket className="w-10 h-10" />, value: projectsCount, label: t('stats.projects') },
    { icon: <Star className="w-10 h-10 text-yellow-400" />, value: starsCount, label: t('stats.stars') },
    { icon: <GitFork className="w-10 h-10 text-blue-400" />, value: forksCount, label: t('stats.forks') },
    { icon: <Award className="w-10 h-10 text-green-400" />, value: 2, label: t('stats.experience'), suffix: '+' }
  ];

  return (
    <section ref={statsRef} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {loading
            ? [...Array(4)].map((_, index) => <StatCardSkeleton key={index} />)
            : achievements.map(({ icon, value, label, suffix = '' }) => (
                <div
                  key={label}
                  className="card-motion transform bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-xl border border-purple-500/30 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl hover:scale-105 hover:-translate-y-2 shadow-subtle-lg hover:shadow-subtle-2xl group"
                >
                  <div className="flex justify-center mb-3 sm:mb-4 group-hover:scale-125 transition-transform">
                    <div className="w-8 h-8 sm:w-10 sm:h-10">
                      {icon}
                    </div>
                  </div>
                  <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {value}
                    {suffix}
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm">{label}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};
