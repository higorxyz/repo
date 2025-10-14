import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import './styles/index.css'
import './styles/theme.css'

const basePath = import.meta.env.BASE_URL || '/'

if (typeof window !== 'undefined') {
  const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) || '/' : basePath
  const normalizedPath = window.location.pathname.endsWith('/') && window.location.pathname !== '/' ? window.location.pathname.slice(0, -1) : window.location.pathname

  if (normalizedPath !== normalizedBase) {
    // Force single-entry routing by stripping unknown subpaths
    window.history.replaceState(null, '', normalizedBase)
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>,
)