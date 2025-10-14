import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 theme-toggle"
      style={{
        backgroundColor: isDark ? '#4c1d95' : '#fbbf24'
      }}
      aria-label={`Mudar para tema ${isDark ? 'claro' : 'escuro'}`}
    >
      {/* Bolinha que desliza com ícone */}
      <div
        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
        style={{
          transform: isDark ? 'translateX(4px)' : 'translateX(31px)'
        }}
      >
        {isDark ? (
          <Moon size={14} className="text-purple-900" />
        ) : (
          <Sun size={14} className="text-yellow-600" />
        )}
      </div>
    </button>
  );
};