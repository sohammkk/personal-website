import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../AppContext'
import { penaltyFacts } from '../content'

type Zone = 'left' | 'center' | 'right'
type Phase = 'ready' | 'shooting' | 'saved' | 'scored'

const ZONES: Zone[] = ['left', 'center', 'right']
const KEEPER_DIVE_X: Record<Zone, number> = { left: -82, center: 0, right: 82 }
const KEEPER_DIVE_ROT: Record<Zone, number> = { left: -55, center: 0, right: 55 }

interface Dive {
  x: number
  y: number
  rot: number
}

// Goal mouth (SVG viewBox coords)
const GOAL = { left: 86, right: 314, top: 86, bottom: 198 }
const BALL_START = { x: 200, y: 246 }

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

/** Rotating "did you know?" trivia about penalty kicks, fading between facts. */
function FunFact() {
  const { t, lang } = useApp()
  const [index, setIndex] = useState(() => Math.floor(Math.random() * penaltyFacts.length))

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % penaltyFacts.length)
    }, 6000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="mt-8 min-h-[4.5rem] border-t border-neutral-200 pt-4 dark:border-neutral-800">
      <p className="text-accent font-mono text-[11px] tracking-widest uppercase">{t('penaltyFactLabel')}</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="mt-1.5 font-mono text-xs text-neutral-500"
        >
          {penaltyFacts[index][lang]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

function Keeper({ phase, dive }: { phase: Phase; dive: Dive }) {
  const diving = phase !== 'ready'
  return (
    // Outer group: pure translation (no origin headaches in SVG)
    <motion.g
      initial={false}
      animate={diving ? { x: dive.x, y: dive.y } : { x: [0, -44, 0, 44, 0], y: 0 }}
      transition={
        diving
          ? { type: 'spring', stiffness: 320, damping: 20, mass: 0.8 }
          : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      {/* Inner group: rotation around the keeper's feet (relative origin, robust for SVG) */}
      <motion.g
        initial={false}
        animate={{ rotate: diving ? dive.rot : 0 }}
        transition={diving ? { duration: 0.4, ease: 'easeOut' } : { duration: 0.3 }}
        style={{ originX: '50%', originY: '100%', transformBox: 'fill-box' }}
      >
        <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none">
          {/* head */}
          <circle cx="200" cy="152" r="9" fill="currentColor" stroke="none" />
          {/* body */}
          <line x1="200" y1="162" x2="200" y2="188" />
          {/* arms up, keeper style */}
          <line x1="200" y1="168" x2="184" y2="152" />
          <line x1="200" y1="168" x2="216" y2="152" />
          {/* legs — feet planted on the goal line */}
          <line x1="200" y1="188" x2="190" y2="208" />
          <line x1="200" y1="188" x2="210" y2="208" />
        </g>
      </motion.g>
    </motion.g>
  )
}

export function PenaltyGame({ onUnlock }: { onUnlock: () => void }) {
  const { t } = useApp()
  const [phase, setPhase] = useState<Phase>('ready')
  const [target, setTarget] = useState(BALL_START)
  const [dive, setDive] = useState<Dive>({ x: 0, y: 0, rot: 0 })
  const [attempts, setAttempts] = useState(0)
  const timers = useRef<number[]>([])

  const shoot = (e: React.MouseEvent<SVGSVGElement>) => {
    if (phase !== 'ready') return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = clamp(((e.clientX - rect.left) / rect.width) * 400, GOAL.left, GOAL.right)
    const y = clamp(((e.clientY - rect.top) / rect.height) * 280, GOAL.top, GOAL.bottom)

    const keeper = ZONES[Math.floor(Math.random() * ZONES.length)]

    // Randomize the dive so no two attempts look alike
    const spread = keeper === 'center' ? Math.random() * 16 - 8 : Math.random() * 26 - 13
    const diveX = KEEPER_DIVE_X[keeper] + spread
    const diveY = keeper === 'center' ? -8 - Math.random() * 14 : 2 + Math.random() * 12

    // Geometric save: the ball is stopped if it ends up within the keeper's reach.
    // Shots at his body are saved; corners are (almost) always in.
    const keeperX = 200 + diveX
    const keeperY = 178 + diveY
    const saved = ((x - keeperX) / 52) ** 2 + ((y - keeperY) / 56) ** 2 < 1

    setDive({
      x: diveX,
      y: diveY,
      rot: KEEPER_DIVE_ROT[keeper] + (keeper === 'center' ? 0 : Math.random() * 18 - 9),
    })
    setTarget(saved ? { x: keeperX, y: Math.max(y, 120) } : { x, y })
    setPhase('shooting')

    timers.current.push(
      window.setTimeout(() => {
        if (saved) {
          setPhase('saved')
          timers.current.push(
            window.setTimeout(() => {
              setAttempts((a) => a + 1)
              setTarget(BALL_START)
              setPhase('ready')
            }, 1200),
          )
        } else {
          setPhase('scored')
          timers.current.push(window.setTimeout(onUnlock, 1600))
        }
      }, 520),
    )
  }

  return (
    <div className="hero-grid flex h-full w-full flex-col items-center justify-center bg-neutral-50 px-6 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="w-full max-w-lg">
        <p className="text-accent font-mono text-sm">{t('penaltyCmd')}</p>
        <p className="mt-1 font-mono text-xl font-bold sm:text-2xl">
          {t('penaltyTitle')}
          <span className="animate-pulse">_</span>
        </p>
        <p className="mt-2 font-mono text-xs text-neutral-500">{t('penaltyHint')}</p>

        <svg
          viewBox="0 0 400 280"
          onClick={shoot}
          role="button"
          aria-label={t('penaltyHint')}
          className={`mt-6 w-full select-none ${phase === 'ready' ? 'cursor-crosshair' : 'cursor-default'}`}
        >
          {/* ground */}
          <line x1="20" y1="210" x2="380" y2="210" stroke="currentColor" strokeWidth="2" opacity="0.25" />
          {/* penalty spot */}
          <circle cx="200" cy="246" r="3" fill="currentColor" opacity="0.2" />

          {/* net */}
          <g opacity="0.15" stroke="currentColor" strokeWidth="1">
            {Array.from({ length: 12 }, (_, i) => (
              <line key={`v${i}`} x1={88 + i * 21} y1="76" x2={88 + i * 21} y2="206" />
            ))}
            {Array.from({ length: 7 }, (_, i) => (
              <line key={`h${i}`} x1="76" y1={88 + i * 18} x2="324" y2={88 + i * 18} />
            ))}
          </g>

          {/* goal frame */}
          <motion.g
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            animate={phase === 'scored' ? { x: [0, -2, 2, -1, 0] } : undefined}
            transition={{ duration: 0.4 }}
          >
            <line x1="74" y1="210" x2="74" y2="74" />
            <line x1="326" y1="210" x2="326" y2="74" />
            <line x1="71" y1="74" x2="329" y2="74" />
          </motion.g>

          {/* keeper */}
          <Keeper phase={phase} dive={dive} />

          {/* ball */}
          <motion.g
            key={attempts}
            initial={false}
            animate={
              phase === 'ready'
                ? { x: 0, y: 0, scale: 1 }
                : { x: target.x - BALL_START.x, y: target.y - BALL_START.y, scale: 0.7 }
            }
            transition={
              phase === 'ready'
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.2, 0.8, 0.4, 1] }
            }
            style={{ transformOrigin: `${BALL_START.x}px ${BALL_START.y}px` }}
          >
            <motion.text
              x={BALL_START.x}
              y={BALL_START.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="30"
              animate={phase === 'shooting' || phase === 'scored' ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformOrigin: `${BALL_START.x}px ${BALL_START.y}px` }}
            >
              ⚽
            </motion.text>
          </motion.g>

          {/* result overlay */}
          {phase === 'scored' && (
            <motion.text
              x="200"
              y="48"
              textAnchor="middle"
              className="fill-accent"
              fontSize="34"
              fontWeight="bold"
              fontFamily="inherit"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: [0.5, 1.15, 1] }}
              transition={{ duration: 0.5 }}
              style={{ transformOrigin: '200px 48px' }}
            >
              {t('penaltyGoal')}
            </motion.text>
          )}
        </svg>

        {/* status line — fixed height to avoid layout shift */}
        <div className="mt-2 flex h-6 items-center font-mono text-xs">
          <span className="text-neutral-500">
            {phase === 'saved' && t('penaltySaved')}
            {phase === 'scored' && <span className="text-accent">{t('penaltyUnlocking')}</span>}
          </span>
        </div>

        <button
          onClick={onUnlock}
          className="hover:text-accent mt-8 font-mono text-xs text-neutral-400 underline-offset-4 transition-colors hover:underline dark:text-neutral-600"
        >
          {t('penaltySkip')}
        </button>

        <FunFact />
      </div>
    </div>
  )
}
