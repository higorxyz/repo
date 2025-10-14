export const getGitHubHeaders = (additionalHeaders = {}) => {
  const headers = { ...additionalHeaders };
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  
  if (token && token !== 'your_github_token_here') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const fetchGitHub = async (url, options = {}) => {
  const headers = getGitHubHeaders(options.headers || {});
  
  return fetch(url, {
    ...options,
    headers
  });
};

export const hasGitHubToken = () => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  return !!(token && token !== 'your_github_token_here');
};

