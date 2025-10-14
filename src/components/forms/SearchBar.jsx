import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const SearchBar = ({ onSearch, totalResults, placeholder }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        {/* Input de busca */}
        <div
          className={`
            relative flex items-center gap-3 
            bg-black/30 backdrop-blur-xl 
            border border-purple-500/30 
            rounded-xl px-4 py-3
            transition-all duration-300 card-motion-input
            ${isFocused ? 'shadow-subtle-xl border-purple-500/60' : 'shadow-subtle'}
          `}
        >
          {/* Ícone de busca */}
          <Search 
            className={`
              w-5 h-5 transition-colors duration-300
              ${isFocused || searchTerm ? 'text-purple-400' : 'text-gray-400'}
            `}
          />

          {/* Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder || t('projects.search')}
            className="
              flex-1 bg-transparent 
              text-white placeholder-gray-400
              outline-none text-sm
            "
          />

          {/* Botão de limpar */}
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="
                p-1 rounded-lg
                bg-purple-500/20 hover:bg-purple-500/30
                text-purple-300 hover:text-purple-200
                transition-all duration-200
              "
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Indicador de resultados */}
        {searchTerm && (
          <div className="mt-2 text-center">
            <span className="text-sm text-gray-400">
              {totalResults === 0 ? (
                <span className="text-yellow-400">{t('projects.noResults')}</span>
              ) : totalResults === 1 ? (
                <span className="text-purple-400">{t('projects.oneResult')}</span>
              ) : (
                <span className="text-purple-400">{t('projects.multipleResults').replace('{count}', totalResults)}</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Dicas de busca */}
      {isFocused && !searchTerm && (
        <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg backdrop-blur-xl">
          <p className="text-xs text-gray-400 mb-2">{t('projects.searchTips')}</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>{t('projects.tip1')}</li>
            <li>{t('projects.tip2')}</li>
            <li>{t('projects.tip3')}</li>
          </ul>
        </div>
      )}
    </div>
  );
};
