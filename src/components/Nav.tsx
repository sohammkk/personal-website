import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useApp } from '../AppContext'
import { site } from '../content'

interface NavItem {
  key: string
  route: 'home' | 'cv'
  id?: string // section to scroll to after arriving
  href: string
}

const items: NavItem[] = [
  { key: 'navHome', route: 'home', href: '#/' },
  { key: 'navQuests', route: 'home', id: 'quests', href: '#quests' },
  { key: 'navCv', route: 'cv', href: '#/cv' },
  { key: 'navContact', route: 'cv', id: 'contact', href: '#contact' },
]

export function Nav({ route }: { route: 'home' | 'cv' }) {
  const { t, lang, setLang, theme, toggleTheme } = useApp()
  const [open, setOpen] = useState(false)

  const go = (item: NavItem) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    const changing = route !== item.route
    if (changing) window.location.hash = item.route === 'cv' ? '#/cv' : '#/'
    if (item.id) {
      const scroll = () =>
        document.getElementById(item.id!)?.scrollIntoView({ behavior: changing ? 'auto' : 'smooth' })
      changing ? window.setTimeout(scroll, 150) : scroll()
    } else if (!changing) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/60 bg-neutral-50/80 font-mono backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-950/80">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a href="#/" className="text-accent text-sm font-semibold tracking-tight sm:text-base">
          {site.name}
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {items.map((l) => (
            <a
              key={l.key}
              href={l.href}
              onClick={go(l)}
              className="text-sm text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
            >
              {t(l.key)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="flex overflow-hidden rounded-full border border-neutral-300 text-xs font-semibold dark:border-neutral-700">
            {(['en', 'de'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`px-2.5 py-1.5 uppercase transition-colors ${
                  lang === l
                    ? 'bg-accent text-white'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full border border-neutral-300 p-2 text-neutral-600 transition-colors hover:text-neutral-950 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-white"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </AnimatePresence>
          </button>

          <button
            className="p-2 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-neutral-200 md:hidden dark:border-neutral-800"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {items.map((l) => (
                <a
                  key={l.key}
                  href={l.href}
                  onClick={go(l)}
                  className="py-2 text-sm text-neutral-600 dark:text-neutral-400"
                >
                  {t(l.key)}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
