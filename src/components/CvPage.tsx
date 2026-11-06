import { motion, useReducedMotion } from 'framer-motion'
import { FileText, Github, Linkedin, Mail } from 'lucide-react'
import { useApp } from '../AppContext'
import { site } from '../content'
import {
  Certifications,
  Education,
  Experience,
  Projects,
  Skills,
  Volunteering,
} from './Sections'

export function CvPage() {
  const { t, lang } = useApp()
  const reduce = useReducedMotion()

  return (
    <main className="pt-16">
      {/* CV header */}
      <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
        <div className="scenery scenery-summit" aria-hidden />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-5xl px-6 py-20"
        >
          <p className="mb-3 font-mono text-sm tracking-widest text-emerald-700 dark:text-accent">
            ~/{site.name.split(' ')[0].toLowerCase()}/cv
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            {t('cvTitle')}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-neutral-800 dark:text-neutral-200">
            {t('cvTagline')}
          </p>
          <div className="mt-8 flex flex-col items-start gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {(['en', 'de'] as const).map((l) => (
                <a
                  key={l}
                  href={site.cv[l]}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    l === lang
                      ? 'bg-accent hover:bg-accent-dim inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.03] active:scale-[0.98]'
                      : 'inline-flex items-center gap-2 rounded-full border border-black/30 bg-stone-100/60 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-all hover:scale-[1.03] hover:border-black/50 active:scale-[0.98] dark:border-white/30 dark:bg-neutral-950/50 dark:hover:border-white/50'
                  }
                >
                  <FileText size={16} /> {t('cvDownload')} ({l.toUpperCase()})
                </a>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              {[
                { href: site.socials.github, icon: Github, label: 'GitHub' },
                { href: site.socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
                { href: `mailto:${site.email}`, icon: Mail, label: 'Email' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={label}
                  className="hover:border-accent hover:text-accent rounded-full border border-black/30 bg-stone-100/60 p-3 backdrop-blur-sm transition-all hover:scale-110 dark:border-white/30 dark:bg-neutral-950/50"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Volunteering />
      <Certifications />
    </main>
  )
}
