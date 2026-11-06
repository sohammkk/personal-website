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
    <section id="top" className="relative flex min-h-screen flex-col justify-center overflow-hidden">
      <div className="scenery scenery-full scenery-meadow" aria-hidden />

      <motion.div
        variants={container}
        initial={reduce ? false : 'hidden'}
        animate="show"
        className="relative mx-auto grid w-full max-w-5xl items-center gap-8 px-6 pt-28 pb-48 sm:gap-10 sm:pt-36 sm:pb-24 lg:grid-cols-[1.3fr_1fr] lg:pt-16 lg:pb-0"
      >
        <div>
          <motion.p variants={item} className="mb-3 font-mono text-sm tracking-widest text-emerald-700 dark:text-accent">
            ~/{site.name.split(' ')[0].toLowerCase()}
          </motion.p>
          <motion.p variants={item} className="mb-4 font-mono text-sm tracking-widest text-emerald-700 uppercase dark:text-accent">
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

          <motion.div variants={item} className="mt-4 flex flex-col gap-1 font-mono text-sm text-neutral-700 dark:text-neutral-300">
            <span>→ {t('heroRole1')}</span>
            <span>→ {t('heroRole2')}</span>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <a
              href={"#contact"}
              className="inline-flex items-center gap-2 rounded-full border border-black/30 bg-stone-100/60 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-all hover:scale-[1.03] hover:border-black/50 active:scale-[0.98] dark:border-white/30 dark:bg-neutral-950/50 dark:hover:border-white/50"
            >
              <Mail size={16} /> {t('heroCta')}
            </a>
            <a
              href={site.cv[lang]}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/30 bg-stone-100/60 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-all hover:scale-[1.03] hover:border-black/50 active:scale-[0.98] dark:border-white/30 dark:bg-neutral-950/50 dark:hover:border-white/50"
            >
              <FileText size={16} /> {t('heroCv')}
            </a>
          </motion.div>
        </div>

        {/* personal photo (placeholder until one is set in content.ts) */}
        <motion.div
          variants={item}
          className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-[20px] border border-black/15 bg-stone-100/80 shadow-[0_24px_60px_rgb(0_0_0/0.14)] backdrop-blur-md sm:mx-auto sm:max-w-xs sm:rounded-3xl dark:border-white/15 dark:bg-neutral-950/60 dark:shadow-[0_24px_60px_rgb(0_0_0/0.55)]"
        >
          {site.photo ? (
            <img src={site.photo} alt={site.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-700 dark:text-neutral-300">
              <User className="size-7 sm:size-10" strokeWidth={1.2} />
              <span className="font-mono text-[11px] sm:text-xs">{'// photo coming soon'}</span>
            </div>
          )}
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-neutral-700 dark:text-neutral-300"
        animate={reduce ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <ArrowDown size={20} />
      </motion.a>
    </section>
  )
}
