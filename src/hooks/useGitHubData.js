import { useState, useEffect, useCallback } from 'react';
import { Code } from 'lucide-react';
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiC,
  SiCplusplus,
  SiGo,
  SiRust,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiHtml5,
  SiCss3,
  SiReact,
  SiVuedotjs,
  SiGnubash,
  SiDotnet,
  SiApple,
  SiDart,
  SiLua,
  SiJupyter,
  SiMysql,
  SiPostgresql,
  SiGraphql,
  SiOpenjdk
} from 'react-icons/si';

const formatRepoName = (name) => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatNumber = (num) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

const LANGUAGE_ICON_MAP = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Python: SiPython,
  Java: SiOpenjdk,
  'C++': SiCplusplus,
  C: SiC,
  'C#': SiDotnet,
  Go: SiGo,
  Rust: SiRust,
  PHP: SiPhp,
  Ruby: SiRuby,
  Swift: SiSwift,
  Kotlin: SiKotlin,
  HTML: SiHtml5,
  CSS: SiCss3,
  Vue: SiVuedotjs,
  React: SiReact,
  Shell: SiGnubash,
  PowerShell: Code,
  'Objective-C': SiApple,
  Dart: SiDart,
  Lua: SiLua,
  Jupyter: SiJupyter,
  Notebook: SiJupyter,
  SQL: SiMysql,
  PostgreSQL: SiPostgresql,
  'PLpgSQL': SiPostgresql,
  GraphQL: SiGraphql
};

const CATEGORY_MAP = {
  JavaScript: 'Frontend',
  TypeScript: 'Frontend',
  Python: 'Backend',
  Java: 'Backend',
  'C++': 'Systems',
  C: 'Systems',
  'C#': 'Backend',
  Go: 'Backend',
  Rust: 'Systems',
  PHP: 'Backend',
  Ruby: 'Backend',
  Swift: 'Mobile',
  Kotlin: 'Mobile',
  HTML: 'Frontend',
  CSS: 'Frontend',
  Vue: 'Frontend',
  React: 'Frontend',
  Shell: 'DevOps',
  Dart: 'Mobile',
  Lua: 'Scripting',
  Jupyter: 'Data Science',
  Notebook: 'Data Science'
};

const getLanguageIcon = (language) => {
  if (!language) return Code;
  const normalized = language.trim();
  return LANGUAGE_ICON_MAP[normalized] || Code;
};
const getLanguageCategory = (language) => CATEGORY_MAP[language] || 'Other';

export const useGitHubData = (username) => {
  const [data, setData] = useState({
    repos: [],
    stats: { totalStars: 0, totalForks: 0, publicRepos: 0 },
    languages: [],
    loading: true,
    error: null
  });

  const fetchGitHubData = useCallback(async () => {
      try {
        const headers = {};
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        
        if (token && token !== 'your_github_token_here') {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
        if (!userResponse.ok) {
          throw new Error('Usuário não encontrado');
        }
        
        const userData = await userResponse.json();

        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
          { headers }
        );
        
        if (!reposResponse.ok) {
          throw new Error('Erro ao buscar repositórios');
        }
        
        const reposData = await reposResponse.json();

        const filteredRepos = reposData
          .filter(repo => !repo.fork && !repo.archived);

        const totalStars = filteredRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const totalForks = filteredRepos.reduce((acc, repo) => acc + repo.forks_count, 0);

        const languagesCount = {};
        filteredRepos.forEach(repo => {
          if (repo.language) {
            languagesCount[repo.language] = (languagesCount[repo.language] || 0) + 1;
          }
        });

        const totalReposWithLang = Object.values(languagesCount).reduce((a, b) => a + b, 0);
        const languagesArray = Object.entries(languagesCount)
          .map(([name, count]) => ({
            name,
            level: Math.round((count / totalReposWithLang) * 100),
            icon: getLanguageIcon(name),
            category: getLanguageCategory(name),
            count
          }))
          .sort((a, b) => b.level - a.level);

        const formattedRepos = filteredRepos.map(repo => ({
          title: formatRepoName(repo.name),
          description: repo.description || 'Projeto desenvolvido no GitHub',
          tech: [
            repo.language,
            ...(repo.topics || []).slice(0, 3)
          ].filter(Boolean),
          link: repo.homepage || repo.html_url,
          github: repo.html_url,
          demo: repo.homepage,
          icon: getLanguageIcon(repo.language),
          status: repo.homepage ? 'live' : 'repo',
          visits: formatNumber(repo.stargazers_count),
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          watchers: repo.watchers_count,
          language: repo.language,
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
          updated: new Date(repo.updated_at),
          featured: repo.stargazers_count >= 3 || !!(repo.homepage && repo.homepage.trim()),
          repoName: repo.name,
          hasReadme: repo.description !== null && repo.description !== ''
        }));

        const sortedRepos = formattedRepos.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          
          if (b.stars !== a.stars) {
            return b.stars - a.stars;
          }
          
          return a.title.localeCompare(b.title);
        });

        setData({
          repos: sortedRepos,
          stats: {
            totalStars,
            totalForks,
            publicRepos: userData.public_repos || filteredRepos.length
          },
          languages: languagesArray,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Erro ao buscar dados do GitHub:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Erro ao carregar dados do GitHub. Usando dados de exemplo.'
        }));
      }
    }, [username]);

  useEffect(() => {
    fetchGitHubData();
  }, [fetchGitHubData]);

  return data;
};
