import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, FileText, Mail, User } from 'lucide-react'
import { useApp } from '../AppContext'
import { site } from '../content'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Hero() {
  const { t, lang } = useApp()
  const reduce = useReducedMotion()
  const [first, last] = site.name.split(' ')

  return (
    <section id="top" className="hero-grid relative flex min-h-screen flex-col justify-center overflow-hidden">
      {/* accent glow */}
      <div className="bg-accent/10 pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full blur-3xl" aria-hidden />

      <motion.div
        variants={container}
        initial={reduce ? false : 'hidden'}
        animate="show"
        className="relative mx-auto grid w-full max-w-5xl items-center gap-10 px-6 pt-16 lg:grid-cols-[1.3fr_1fr]"
      >
        <div>
          <motion.p variants={item} className="text-accent mb-3 font-mono text-sm tracking-widest opacity-80">
            ~/{site.name.split(' ')[0].toLowerCase()}
          </motion.p>
          <motion.p variants={item} className="text-accent mb-4 font-mono text-sm tracking-widest uppercase">
            {t('heroHello')}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-5xl leading-none font-bold tracking-tight sm:text-7xl lg:text-7xl"
          >
            {first}
            <br />
            {last}
          </motion.h1>

          <motion.div variants={item} className="mt-4 flex flex-col gap-1 font-mono text-sm text-neutral-500">
            <span>→ {t('heroRole1')}</span>
            <span>→ {t('heroRole2')}</span>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <a
              href={"#contact"}
              className="bg-accent hover:bg-accent-dim inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <Mail size={16} /> {t('heroCta')}
            </a>
            <a
              href={site.cv[lang]}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.03] hover:border-neutral-500 active:scale-[0.98] dark:border-neutral-700 dark:hover:border-neutral-400"
            >
              <FileText size={16} /> {t('heroCv')}
            </a>
          </motion.div>
        </div>

        {/* personal photo (placeholder until one is set in content.ts) */}
        <motion.div
          variants={item}
          className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
        >
          {site.photo ? (
            <img src={site.photo} alt={site.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-400 dark:text-neutral-600">
              <User size={40} strokeWidth={1.2} />
              <span className="font-mono text-xs">{'// photo coming soon'}</span>
            </div>
          )}
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-neutral-400"
        animate={reduce ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <ArrowDown size={20} />
      </motion.a>
    </section>
  )
}
