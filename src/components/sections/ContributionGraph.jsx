import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';

const CELL_SIZE = 12;
const CELL_GAP = 3;
const MONTH_LABEL_HEIGHT = 18;
const SIDE_LABEL_WIDTH = 28;
const LABEL_GAP = 12;

const buildTimeline = (map, locale) => {
  const weeks = [];
  const months = [];
  const days = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(today);
  const endDay = endDate.getDay();
  const adjustedEnd = new Date(endDate);
  adjustedEnd.setDate(endDate.getDate() + (6 - endDay));

  const startDate = new Date(adjustedEnd);
  startDate.setDate(adjustedEnd.getDate() - ((53 * 7) - 1));

  const current = new Date(startDate);
  let previousMonth = null;
  let lastLabelWeek = -1;

  for (let weekIndex = 0; weekIndex < 53; weekIndex += 1) {
    const week = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const dateKey = current.toISOString().split('T')[0];
      const dateClone = new Date(current);
      const count = map.get(dateKey) || 0;

      week.push({
        date: dateClone,
        dateKey,
        count,
        weekIndex,
        dayIndex
      });

      days.push({
        date: dateClone,
        count
      });

      if (dayIndex === 0) {
        const month = dateClone.getMonth();
        const shouldRenderLabel =
          weekIndex === 0 || (month !== previousMonth && weekIndex - lastLabelWeek >= 2);

        if (shouldRenderLabel) {
          months.push({
            label: dateClone
              .toLocaleString(locale, { month: 'short' })
              .replace('.', ''),
            weekIndex
          });
          lastLabelWeek = weekIndex;
        }

        previousMonth = month;
      }

      current.setDate(current.getDate() + 1);
    }

    weeks.push(week);
  }

  return { weeks, months, days };
};

const calculateCurrentStreak = (days) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let streak = 0;

  for (let index = days.length - 1; index >= 0; index -= 1) {
    const day = days[index];
    if (day.date > now) {
      continue;
    }

    if (day.count > 0) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
};

const calculateLongestStreak = (days) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let current = 0;
  let longest = 0;

  days.forEach((day) => {
    if (day.date > now) {
      return;
    }

    if (day.count > 0) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  });

  return longest;
};

export const ContributionGraph = ({ username = 'higorxyz' }) => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [contributionMap, setContributionMap] = useState(() => new Map());

  const isDarkMode = theme === 'dark';
  const locale = language === 'en' ? 'en-US' : 'pt-BR';

  useEffect(() => {
    let isMounted = true;

    const fetchContributions = async () => {
      setLoading(true);

      const requestFallback = async () => {
        try {
          const headers = {};
          const token = import.meta.env.VITE_GITHUB_TOKEN;
          
          if (token && token !== 'your_github_token_here') {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await fetch(
            `https://api.github.com/users/${username}/events/public?per_page=100`,
            { headers }
          );

          if (!response.ok) {
            return null;
          }

          const events = await response.json();
          const map = new Map();

          events.forEach((event) => {
            const date = new Date(event.created_at);
            date.setHours(0, 0, 0, 0);
            const dateKey = date.toISOString().split('T')[0];
            map.set(dateKey, (map.get(dateKey) || 0) + 1);
          });

          return map;
        } catch (fallbackError) {
          console.error('Erro no fallback:', fallbackError);
          return null;
        }
      };

      try {
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar contribuições');
        }

        const data = await response.json();
        const map = new Map();

        data.contributions.forEach(({ date, count }) => {
          map.set(date, count);
        });

        if (isMounted) {
          setContributionMap(map);
        }
      } catch (error) {
        console.error('Erro ao buscar contribuições:', error);
        const fallbackMap = await requestFallback();
        if (isMounted && fallbackMap) {
          setContributionMap(fallbackMap);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchContributions();

    return () => {
      isMounted = false;
    };
  }, [username]);

  const timeline = useMemo(
    () => buildTimeline(contributionMap, locale),
    [contributionMap, locale]
  );

  const totalContributions = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return timeline.days.reduce((sum, day) => (
      day.date <= now ? sum + day.count : sum
    ), 0);
  }, [timeline.days]);

  const currentStreak = useMemo(
    () => calculateCurrentStreak(timeline.days),
    [timeline.days]
  );

  const longestStreak = useMemo(
    () => calculateLongestStreak(timeline.days),
    [timeline.days]
  );

  const dayLabels = language === 'en'
    ? ['Mon', 'Wed', 'Fri']
    : ['Seg', 'Qua', 'Sex'];

  const dayLabelIndexes = [1, 3, 5];

  const getContributionColors = (count) => {
    const darkPalette = [
      { max: 0, bg: '#161b22', border: '#1b1f23' },
      { max: 2, bg: '#372264', border: '#4c1d95' },
      { max: 5, bg: '#4c1d95', border: '#5b21b6' },
      { max: 8, bg: '#6d28d9', border: '#7c3aed' },
      { max: Infinity, bg: '#a855f7', border: '#c084fc' }
    ];

    const lightPalette = [
      { max: 0, bg: '#ebedf0', border: '#d0d7de' },
      { max: 2, bg: '#e9d5ff', border: '#d8b4fe' },
      { max: 5, bg: '#c4b5fd', border: '#a78bfa' },
      { max: 8, bg: '#a78bfa', border: '#8b5cf6' },
      { max: Infinity, bg: '#7c3aed', border: '#5b21b6' }
    ];

    const palette = isDarkMode ? darkPalette : lightPalette;
    return palette.find((tone) => count <= tone.max) || palette[palette.length - 1];
  };

  const legendSteps = [0, 2, 5, 8, 12];

  const formatStreak = (value, kind) => {
    if (language === 'en') {
      const dayWord = value === 1 ? 'day' : 'days';
      return `${kind === 'current' ? 'Current streak' : 'Longest streak'}: ${value} ${dayWord}`;
    }

    const dayWord = value === 1 ? 'dia' : 'dias';
    return `${kind === 'current' ? 'Sequência atual' : 'Maior sequência'}: ${value} ${dayWord}`;
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
          }`} />
        </div>
      </div>
    );
  }

  const graphWidth = timeline.weeks.length
    ? (timeline.weeks.length * (CELL_SIZE + CELL_GAP)) - CELL_GAP
    : 0;
  const gridHeight = (CELL_SIZE * 7) + (CELL_GAP * 6);
  const totalContentWidth = graphWidth + SIDE_LABEL_WIDTH + LABEL_GAP;
  const infoWidthStyle = graphWidth
    ? { width: totalContentWidth, maxWidth: '100%', margin: '0 auto' }
    : { width: '100%', margin: '0 auto' };
  const graphRowStyle = graphWidth
    ? { width: totalContentWidth, maxWidth: '100%', margin: '0 auto' }
    : { width: '100%', margin: '0 auto' };

  const contributionsLabelSingular = t('contributions.contribution');
  const contributionsLabelPlural = t('contributions.contributions');

  const totalFormatted = totalContributions.toLocaleString(locale);

  return (
    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 ${
      isDarkMode
        ? 'bg-gradient-to-br from-purple-950/50 to-pink-950/30 border-purple-500/30 shadow-lg shadow-purple-500/20'
        : 'bg-white border-purple-300 shadow-lg shadow-purple-200/50'
    }`}>
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}
          style={infoWidthStyle}
        >
          <span className="text-center sm:text-left">
            {totalFormatted} {t('contributions.title')}
          </span>
          <div className={`flex items-center justify-center sm:justify-end gap-3 text-[10px] sm:text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <span>{formatStreak(currentStreak, 'current')}</span>
            <span>{formatStreak(longestStreak, 'longest')}</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto contribution-graph-scroll">
          <div className="min-w-max mx-auto px-2">
            <div className="flex gap-3" style={graphRowStyle}>
              <div
                className="relative"
                style={{ width: SIDE_LABEL_WIDTH, height: gridHeight + MONTH_LABEL_HEIGHT }}
              >
                {dayLabelIndexes.map((dayIndex, idx) => {
                  const top = (dayIndex * (CELL_SIZE + CELL_GAP)) + (CELL_SIZE / 2) + MONTH_LABEL_HEIGHT;
                  return (
                    <span
                      key={dayIndex}
                      className={`absolute left-0 -translate-y-1/2 text-[9px] sm:text-[11px] ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}
                      style={{ top }}
                    >
                      {dayLabels[idx]}
                    </span>
                  );
                })}
              </div>

              <div
                className="relative"
                style={{ width: graphWidth, paddingTop: MONTH_LABEL_HEIGHT }}
              >
                <div
                  className="absolute top-0 left-0 right-0"
                  style={{ height: MONTH_LABEL_HEIGHT }}
                >
                  {timeline.months.map((month) => (
                    <span
                      key={`${month.label}-${month.weekIndex}`}
                      className={`absolute text-[9px] sm:text-[11px] ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}
                      style={{ left: month.weekIndex * (CELL_SIZE + CELL_GAP) }}
                    >
                      {month.label}
                    </span>
                  ))}
                </div>

                <div className="flex gap-[3px]">
                  {timeline.weeks.map((week) => (
                    <div key={week[0].dateKey} className="flex flex-col gap-[3px]">
                      {week.map((day) => {
                        const { bg, border } = getContributionColors(day.count);
                        const dateLabel = day.date.toLocaleDateString(locale, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        });

                        const contributionLabel = day.count === 1
                          ? contributionsLabelSingular
                          : contributionsLabelPlural;

                        return (
                          <div
                            key={day.dateKey}
                            className={`rounded-[2px] transition-transform duration-150 ease-out hover:scale-110`}
                            style={{
                              width: CELL_SIZE,
                              height: CELL_SIZE,
                              backgroundColor: bg,
                              border: `1px solid ${border}`
                            }}
                            title={`${dateLabel}: ${day.count} ${contributionLabel}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`w-full flex items-center justify-center sm:justify-end gap-1 text-[9px] sm:text-[11px] ${
          isDarkMode ? 'text-gray-500' : 'text-gray-600'
        }`}
          style={infoWidthStyle}
        >
          <span>{t('contributions.less')}</span>
          {legendSteps.map((step) => {
            const { bg, border } = getContributionColors(step);
            return (
              <span
                key={step}
                className="rounded-[2px]"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: bg,
                  border: `1px solid ${border}`
                }}
              />
            );
          })}
          <span>{t('contributions.more')}</span>
        </div>
      </div>
    </div>
  );
};

