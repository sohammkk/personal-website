import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Section({
  id,
  title,
  children,
  className = '',
}: {
  id: string
  title: string
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <section id={id} className={`mx-auto max-w-5xl px-6 py-20 ${className}`}>
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="font-display mb-10 text-3xl font-bold tracking-tight sm:text-4xl"
      >
        <span className="text-accent mr-2 font-mono text-xl">/</span>
        {title}
      </motion.h2>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </section>
  )
}
