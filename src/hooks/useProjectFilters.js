import { useMemo, useState } from 'react';

export const useProjectFilters = (projects = []) => {
  const [filterTech, setFilterTech] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allTechs = useMemo(() => (
    ['all', ...new Set(projects.flatMap((project) => project.tech || []))]
  ), [projects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects || [];

    if (filterTech !== 'all') {
      filtered = filtered.filter((project) => project.tech && project.tech.includes(filterTech));
    }

    if (searchTerm && searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((project) => {
        const { name, title, tech = [], description = '' } = project;
        const matchName = name && name.toLowerCase().includes(search);
        const matchTitle = title && title.toLowerCase().includes(search);
        const matchTech = tech.some((item) => item && item.toLowerCase().includes(search));
        const matchDesc = description.toLowerCase().includes(search);
        return matchName || matchTitle || matchTech || matchDesc;
      });
    }

    return filtered.slice(0, 6);
  }, [projects, filterTech, searchTerm]);

  return {
    filterTech,
    setFilterTech,
    searchTerm,
    setSearchTerm,
    filteredProjects,
    allTechs
  };
};
