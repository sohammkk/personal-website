import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Lang } from './content'
import { ui } from './content'

type Theme = 'light' | 'dark'

interface AppContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  theme: Theme
  toggleTheme: () => void
  t: (key: string) => string
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem('lang')
    if (stored === 'en' || stored === 'de') return stored
    return navigator.language.startsWith('de') ? 'de' : 'en'
  })
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const t = (key: string) => ui[key]?.[lang] ?? key

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang: setLangState,
        theme,
        toggleTheme: () => setTheme((p) => (p === 'dark' ? 'light' : 'dark')),
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
