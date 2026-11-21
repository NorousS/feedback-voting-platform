import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

type Theme = 'light' | 'dark'

function getSavedTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  try {
    return window.localStorage.getItem('feedback-theme') === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function Layout() {
  const [theme, setTheme] = useState<Theme>(getSavedTheme)

  useEffect(() => {
    try {
      window.localStorage.setItem('feedback-theme', theme)
    } catch {
      // Настройка продолжит работать, даже если localStorage недоступен
    }
  }, [theme])

  function toggleTheme(): void {
    setTheme((current) => current === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand">Feedback<span>Hub</span></NavLink>
          <nav aria-label="Основная навигация">
            <NavLink to="/" end>Главная</NavLink>
            <NavLink to="/surveys">Опросы</NavLink>
            <NavLink to="/feedback">Отзывы</NavLink>
            <NavLink to="/about">О проекте</NavLink>
          </nav>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
            aria-pressed={theme === 'dark'}
          >
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
            {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
          </button>
        </div>
      </header>
      <main className="container"><Outlet /></main>
      <footer className="footer">Курсовой проект · Node.js + React 19 + TypeScript</footer>
    </div>
  )
}
