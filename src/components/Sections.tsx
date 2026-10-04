import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ExternalLink, Github, Linkedin, Lock, Mail, MapPin, Phone } from 'lucide-react'
import { useApp } from '../AppContext'
import {
  certifications,
  education,
  experience,
  languages,
  projects,
  site,
  skills,
  volunteering,
  type ExperienceItem,
} from '../content'
import { Section } from './Section'
import { IPod } from './IPod'

export function About() {
  const { t } = useApp()
  return (
    <Section id="about" title={t('aboutTitle')}>
      <div className="grid items-center gap-12 md:grid-cols-[1.4fr_1fr]">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          {t('aboutText')}
        </p>
        <IPod />
      </div>
    </Section>
  )
}

function Timeline({ items }: { items: ExperienceItem[] }) {
  const { lang } = useApp()
  const reduce = useReducedMotion()
  return (
    <ol className="relative space-y-10 border-l border-neutral-200 pl-8 dark:border-neutral-800">
      {items.map((job, i) => (
        <motion.li
          key={i}
          initial={reduce ? false : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="relative"
        >
          <span className="bg-accent absolute top-1.5 -left-[2.35rem] h-3 w-3 rounded-full ring-4 ring-neutral-50 dark:ring-neutral-950" />
          <p className="font-mono text-xs tracking-wide text-neutral-500 uppercase">
            {job.period[lang]}
          </p>
          <h3 className="font-display mt-1 text-xl font-semibold">{job.role[lang]}</h3>
          <p className="text-accent text-sm font-medium">{job.company}</p>
          <ul className="mt-3 space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400">
            {job.bullets[lang].map((b, j) => (
              <li key={j} className="flex gap-2">
                <span className="text-accent mt-0.5">·</span>
                {b}
              </li>
            ))}
          </ul>
        </motion.li>
      ))}
    </ol>
  )
}

export function Experience() {
  const { t } = useApp()
  return (
    <Section id="experience" title={t('experienceTitle')}>
      <Timeline items={experience} />
    </Section>
  )
}

export function Volunteering() {
  const { t } = useApp()
  return (
    <Section id="volunteering" title={t('volunteeringTitle')}>
      <Timeline items={volunteering} />
    </Section>
  )
}

export function Education() {
  const { t, lang } = useApp()
  const reduce = useReducedMotion()
  return (
    <Section id="education" title={t('educationTitle')}>
      <ol className="relative space-y-10 border-l border-neutral-200 pl-8 dark:border-neutral-800">
        {education.map((e, i) => (
          <motion.li
            key={i}
            initial={reduce ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="relative"
          >
            <span className="bg-accent absolute top-1.5 -left-[2.35rem] h-3 w-3 rounded-full ring-4 ring-neutral-50 dark:ring-neutral-950" />
            <p className="font-mono text-xs tracking-wide text-neutral-500 uppercase">
              {e.period[lang]}
            </p>
            <h3 className="font-display mt-1 text-xl font-semibold">{e.school[lang]}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{e.degree[lang]}</p>
            <p className="text-accent mt-1 text-sm font-medium">{e.grade[lang]}</p>
          </motion.li>
        ))}
      </ol>
    </Section>
  )
}

export function Projects() {
  const { t, lang } = useApp()
  const reduce = useReducedMotion()
  return (
    <Section id="projects" title={t('projectsTitle')}>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={reduce ? undefined : { y: -6 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
          >
            {/* project image (placeholder until one is set in content.ts) */}
            <div className="hero-grid relative aspect-video w-full overflow-hidden border-b border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800/50">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title[lang]}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-neutral-400 dark:text-neutral-600">
                  {'// image coming soon'}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-6">
              <p className="font-mono text-xs text-neutral-500">{p.period[lang]}</p>
              {p.website ? (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display group-hover:text-accent mt-1 inline-flex items-center gap-1.5 text-lg font-semibold transition-colors"
                >
                  <span>{p.title[lang]}</span>
                  <ExternalLink size={14} className="opacity-70" />
                </a>
              ) : (
                <h3 className="font-display group-hover:text-accent mt-1 text-lg font-semibold transition-colors">
                  {p.title[lang]}
                </h3>
              )}
              <p className="mt-2 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
                {p.description[lang]}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-accent/10 text-accent-dim dark:text-accent rounded-full px-2.5 py-0.5 font-mono text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* repo link or status */}
              <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                {p.repo ? (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent inline-flex items-center gap-1.5 font-mono text-xs text-neutral-500 transition-colors"
                  >
                    <Github size={14} /> {t('repoView')}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-400 dark:text-neutral-600">
                    {p.repoStatus === 'private' ? <Lock size={13} /> : <Github size={13} />}
                    {p.repoStatus === 'private' ? t('repoPrivate') : t('repoSoon')}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

function SkillBar({ name, percent, delay }: { name: string; percent: number; delay: number }) {
  const reduce = useReducedMotion()
  return (
    <div className="w-full">
      <p className="mb-1 text-sm">{name}</p>
      {/* The full-width track observes the viewport (a 0-width bar can't be
          reliably detected on mobile), and the fill animates via scaleX. */}
      <motion.div
        className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
        initial={reduce ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="h-full" style={{ width: `${percent}%` }}>
          <motion.div
            className="bg-accent h-full w-full origin-left rounded-full"
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
            transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export function Skills() {
  const { t, lang } = useApp()
  return (
    <Section id="skills" title={t('skillsTitle')}>
      <div className="space-y-12">
        {skills.map((cat) => (
          <div key={cat.category.en}>
            <p className="mb-4 font-mono text-sm tracking-wide text-neutral-600 dark:text-neutral-400 uppercase">
              <span className="text-accent">#</span> {cat.category[lang]}
            </p>
            <div className="grid gap-x-12 gap-y-4 sm:grid-cols-2">
              {cat.items.map((s, i) => (
                <SkillBar key={s.name} name={s.name} percent={s.percent} delay={i * 0.04} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-display mt-14 mb-3 text-xl font-semibold">{t('languagesTitle')}</h3>
      <p className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
        {languages.map((l) => (
          <span key={l.name.en}>
            <span className="text-accent font-mono">#</span> {l.name[lang]} —{' '}
            <span className="font-mono">{l.level}</span>
          </span>
        ))}
      </p>
    </Section>
  )
}

export function Certifications() {
  const { t } = useApp()
  return (
    <Section id="certs" title={t('certsTitle')}>
      <div className="grid gap-2 sm:grid-cols-2">
        {certifications.map((c) => (
          <a
            key={c.title}
            href={c.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
          >
            <span>
              {c.title} <span className="text-neutral-500">— {c.issuer}</span>
            </span>
            <ExternalLink size={14} className="group-hover:text-accent shrink-0 text-neutral-400 transition-colors" />
          </a>
        ))}
      </div>
    </Section>
  )
}

export function Contact() {
  const { t } = useApp()
  return (
    <Section id="contact" title={t('contactTitle')}>
      <div className="mt-8 flex flex-col gap-3 text-sm">
        <a href={`mailto:${site.email}`} className="hover:text-accent flex items-center gap-3 transition-colors">
          <Mail size={16} className="text-accent" /> {site.email}
        </a>
        <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-accent flex items-center gap-3 transition-colors">
          <Phone size={16} className="text-accent" /> {site.phone}
        </a>
        <span className="flex items-center gap-3">
          <MapPin size={16} className="text-accent" /> {site.location}
        </span>
      </div>
      <div className="mt-8 flex gap-3">
        {[
          { href: site.socials.github, icon: Github, label: 'GitHub' },
          { href: site.socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
        ].map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="hover:border-accent hover:text-accent rounded-full border border-neutral-300 p-3 transition-all hover:scale-110 dark:border-neutral-700"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </Section>
  )
}

export function CvCta() {
  const { t } = useApp()
  const reduce = useReducedMotion()
  return (
    <section id="cv-cta" className="mx-auto max-w-5xl px-6 py-20">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="font-mono text-sm text-neutral-600 dark:text-neutral-400">
          <span className="text-accent">{'// '}</span>
          {t('cvCtaText')}
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {t('cvCtaTitle')}
        </h2>
        <a
          href="#/cv"
          className="bg-accent hover:bg-accent-dim mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
        >
          {t('cvCtaBtn')} <ArrowRight size={16} />
        </a>
      </motion.div>
    </section>
  )
}

export function Footer({ onReplay: _onReplay }: { onReplay?: () => void }) {
  const { t } = useApp()
  const links = [
    { label: 'Email', href: `mailto:${site.email}` },
    { label: 'GitHub', href: site.socials.github },
    { label: 'LinkedIn', href: site.socials.linkedin },
  ]
  return (
    <footer className="border-t border-neutral-200 px-6 py-12 text-center dark:border-neutral-800">
      <div className="mx-auto max-w-5xl space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
        <p className="flex flex-wrap items-center justify-center gap-x-2">
          {links.map((l, i) => (
            <span key={l.label} className="flex items-center gap-x-2">
              {i > 0 && <span aria-hidden>·</span>}
              <a
                href={l.href}
                target={l.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noreferrer"
                className="hover:text-accent underline decoration-neutral-300 underline-offset-4 transition-colors dark:decoration-neutral-700"
              >
                {l.label}
              </a>
            </span>
          ))}
        </p>

        <p>English · Deutsch · हिन्दी · मराठी</p>

        <p>
          <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a> · {site.location}
        </p>

        <p className="pt-4 text-xs text-neutral-600 dark:text-neutral-400">
          © {new Date().getFullYear()} {site.name}. {t('footerRights')}
        </p>
      </div>
    </footer>
  )
}
