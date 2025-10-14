import { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';

export const ContributionGraph = ({ username = 'higorxyz' }) => {
  const { theme } = useTheme(); // Usar contexto em vez de MutationObserver
  const { t } = useLanguage();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, currentStreak: 0, longestStreak: 0 });
  
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const fetchContributions = async () => {
      setLoading(true);
      try {
        // Usar API que faz scraping do perfil público do GitHub
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar contribuições');
        }

        const data = await response.json();
        
        // Processar dados da API
        const contributionMap = processContributionsFromAPI(data);
        setContributions(contributionMap);
        
        // Calcular estatísticas
        const total = data.total.lastYear || 0;
        const currentStreak = calculateCurrentStreak(contributionMap);
        const longestStreak = calculateLongestStreak(contributionMap);
        
        setStats({ total, currentStreak, longestStreak });
      } catch (error) {
        console.error('Erro ao buscar contribuições:', error);
        // Fallback para o método antigo se a API falhar
        fallbackFetch();
      } finally {
        setLoading(false);
      }
    };

    const fallbackFetch = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/events/public?per_page=100`
        );

        if (!response.ok) return;

        const events = await response.json();
        const contributionMap = processEvents(events);
        setContributions(contributionMap);
        
        const total = contributionMap.reduce((sum, day) => sum + day.count, 0);
        const currentStreak = calculateCurrentStreak(contributionMap);
        const longestStreak = calculateLongestStreak(contributionMap);
        
        setStats({ total, currentStreak, longestStreak });
      } catch (error) {
        console.error('Erro no fallback:', error);
      }
    };

    fetchContributions();
  }, [username]);

  const processContributionsFromAPI = (data) => {
    const days = [];
    const today = new Date();
    const currentDay = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay - (51 * 7));

    // Criar mapa de contribuições por data
    const contributionMap = {};
    data.contributions.forEach(contrib => {
      contributionMap[contrib.date] = contrib.count;
    });

    // Criar array de 371 dias (53 semanas)
    for (let i = 0; i < 371; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      
      days.push({
        date: dateKey,
        count: contributionMap[dateKey] || 0,
        day: date.getDay(),
        week: Math.floor(i / 7)
      });
    }

    return days;
  };

  const processEvents = (events) => {
    const days = [];
    const today = new Date();
    const contributionCount = {};

    // Processar eventos
    events.forEach(event => {
      const date = new Date(event.created_at);
      const dateKey = date.toISOString().split('T')[0];
      contributionCount[dateKey] = (contributionCount[dateKey] || 0) + 1;
    });

    // Calcular início (domingo da semana atual menos 52 semanas)
    const currentDay = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay - (51 * 7)); // 52 semanas começando no domingo

    // Criar array de 371 dias (53 semanas) para garantir cobertura completa
    for (let i = 0; i < 371; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      
      days.push({
        date: dateKey,
        count: contributionCount[dateKey] || 0,
        day: date.getDay(),
        week: Math.floor(i / 7)
      });
    }

    return days;
  };

  const calculateCurrentStreak = (days) => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const calculateLongestStreak = (days) => {
    let currentStreak = 0;
    let longestStreak = 0;
    
    days.forEach(day => {
      if (day.count > 0) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return longestStreak;
  };

  const getContributionColor = (count) => {
    if (count === 0) {
      return isDarkMode 
        ? 'bg-[#161b22] border-[#1b1f23]' 
        : 'bg-[#ebedf0] border-[#e1e4e8]';
    }
    
    if (count <= 2) {
      return isDarkMode 
        ? 'bg-purple-900/40 border-purple-800/50' 
        : 'bg-purple-200/60 border-purple-300';
    }
    
    if (count <= 5) {
      return isDarkMode 
        ? 'bg-purple-700/60 border-purple-600/70' 
        : 'bg-purple-400/70 border-purple-500';
    }
    
    if (count <= 8) {
      return isDarkMode 
        ? 'bg-purple-600/80 border-purple-500/80' 
        : 'bg-purple-600/80 border-purple-700';
    }
    
    return isDarkMode 
      ? 'bg-purple-500 border-purple-400' 
      : 'bg-purple-800 border-purple-900';
  };

  const getMonthLabels = () => {
    const months = [];
    const today = new Date();
    const startDate = new Date(today);
    const currentDay = today.getDay();
    startDate.setDate(today.getDate() - currentDay - (51 * 7));
    
    let currentMonth = startDate.getMonth();
    
    for (let week = 0; week < 53; week++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (week * 7));
      const month = date.getMonth();
      
      if (month !== currentMonth) {
        months.push({
          name: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
          week: week
        });
        currentMonth = month;
      }
    }
    
    return months;
  };

  if (loading) {
    return (
      <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-purple-950/50 to-pink-950/30 border-purple-500/30 shadow-lg shadow-purple-500/20' 
          : 'bg-white border-purple-300 shadow-lg shadow-purple-200/50'
      }`}>
        <h3 className={`text-xs sm:text-sm font-normal mb-3 sm:mb-4 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Carregando contribuições...
        </h3>
        <div className="flex items-center justify-center py-12 sm:py-20">
          <div className={`animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 ${
            isDarkMode 
              ? 'border-purple-500 border-t-transparent' 
              : 'border-purple-600 border-t-transparent'
          }`}></div>
        </div>
      </div>
    );
  }

  const weeks = 53;

  return (
    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-purple-950/50 to-pink-950/30 border-purple-500/30 shadow-lg shadow-purple-500/20' 
        : 'bg-white border-purple-300 shadow-lg shadow-purple-200/50'
    }`}>
      {/* Título acima do gráfico - sempre visível */}
      <div className="mb-3 sm:mb-4">
        <h3 className={`text-xs sm:text-sm font-normal ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {stats.total} {t('contributions.title')}
        </h3>
      </div>

      {/* Container com scroll horizontal no mobile */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 contribution-graph-scroll">
        {/* Gráfico centralizado em telas maiores */}
        <div className="inline-block min-w-full sm:min-w-0">
          <div className="flex justify-center">
            <div className="inline-block">
              {/* Gráfico */}
              <div className="pb-2">
                <div className="inline-flex gap-[2px] sm:gap-[3px]">
                  {/* Labels dos dias da semana */}
                  <div className="flex flex-col justify-around" style={{ paddingTop: '15px', width: '24px' }}>
                    {['Mon', 'Wed', 'Fri'].map((day, index) => (
                      <div key={index} className="h-[8px] sm:h-[10px] flex items-center">
                        <span className={`text-[9px] sm:text-[11px] leading-none ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {day}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div>
                    {/* Labels dos meses */}
                    <div className="flex gap-[2px] sm:gap-[3px] mb-1 h-[12px] sm:h-[13px] relative">
                      {getMonthLabels().map((month, index) => (
                        <div 
                          key={index} 
                          className="absolute"
                          style={{ left: `${month.week * (window.innerWidth < 640 ? 10 : 13)}px` }}
                        >
                          <span className={`text-[9px] sm:text-[11px] leading-none font-normal ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {month.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Grid de contribuições */}
                    <div className="flex gap-[2px] sm:gap-[3px]">
                      {Array.from({ length: weeks }).map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-[2px] sm:gap-[3px]">
                          {Array.from({ length: 7 }).map((_, dayIndex) => {
                            const contributionIndex = weekIndex * 7 + dayIndex;
                            const contribution = contributions[contributionIndex];
                            
                            if (!contribution) return (
                              <div key={dayIndex} className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px]"></div>
                            );
                            
                            return (
                              <div
                                key={dayIndex}
                                className={`w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[2px] border transition-all duration-150 hover:ring-2 hover:ring-offset-1 ${
                                  isDarkMode ? 'hover:ring-purple-400 hover:ring-offset-gray-900' : 'hover:ring-purple-500 hover:ring-offset-white'
                                } cursor-pointer ${getContributionColor(contribution.count)}`}
                                title={`${new Date(contribution.date).toLocaleDateString('pt-BR', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}: ${contribution.count} contribuiç${contribution.count === 1 ? 'ão' : 'ões'}`}
                              ></div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Legenda abaixo do gráfico - alinhada à direita do gráfico */}
              <div className="flex items-center justify-end gap-1 mt-3 sm:mt-4 text-[9px] sm:text-[11px]">
                <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {t('contributions.less')}
                </span>
                <div className={`w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[2px] border ${
                  isDarkMode ? 'bg-[#161b22] border-[#1b1f23]' : 'bg-[#ebedf0] border-[#e1e4e8]'
                }`}></div>
                <div className={`w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[2px] border ${
                  isDarkMode ? 'bg-purple-900/40 border-purple-800/50' : 'bg-purple-200/60 border-purple-300'
                }`}></div>
                <div className={`w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[2px] border ${
                  isDarkMode ? 'bg-purple-700/60 border-purple-600/70' : 'bg-purple-400/70 border-purple-500'
                }`}></div>
                <div className={`w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[2px] border ${
                  isDarkMode ? 'bg-purple-600/80 border-purple-500/80' : 'bg-purple-600/80 border-purple-700'
                }`}></div>
                <div className={`w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[2px] border ${
                  isDarkMode ? 'bg-purple-500 border-purple-400' : 'bg-purple-800 border-purple-900'
                }`}></div>
                <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {t('contributions.more')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

