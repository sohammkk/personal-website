import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useApp } from '../AppContext'
import { site } from '../content'

// ------------------------------------------------------------------
// Live stock chart — Twelve Data API (free key: https://twelvedata.com/)
// ------------------------------------------------------------------

const STOCKS = ['NVDA', 'AAPL', 'MSFT', 'SPY'] as const
type Symbol = (typeof STOCKS)[number]

interface PricePoint {
  date: Date
  value: number
}

// Demo data shown when no API key is configured or the API is unreachable
const FALLBACK_PRICES: PricePoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (29 - i))
  const trend = 160 + i * 1.9
  const wave = Math.sin(i * 1.7) * 6 + Math.sin(i * 0.6) * 9
  return { date: d, value: Math.round((trend + wave) * 100) / 100 }
})

// Chart geometry (viewBox units)
const W = 800
const H = 300
const M = { top: 16, right: 16, bottom: 34, left: 58 }
const PLOT_W = W - M.left - M.right
const PLOT_H = H - M.top - M.bottom

function fmtPrice(v: number) {
  return `$${v.toLocaleString('en-US', { maximumFractionDigits: v < 10 ? 2 : v < 1000 ? 2 : 0 })}`
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function MarketChart() {
  const { t } = useApp()
  const reduce = useReducedMotion()
  const [active, setActive] = useState<Symbol>('NVDA')
  const [cache, setCache] = useState<Partial<Record<Symbol, PricePoint[]>>>({})
  const [failed, setFailed] = useState(false)
  const [hover, setHover] = useState<number | null>(null)
  const hasKey = site.twelveData.apiKey.length > 0

  useEffect(() => {
    if (!hasKey || cache[active]) return
    let cancelled = false
    setFailed(false)
    fetch(
      `https://api.twelvedata.com/time_series?symbol=${active}&interval=1day&outputsize=60&apikey=${site.twelveData.apiKey}`,
    )
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d: { status?: string; values?: { datetime: string; close: string }[] }) => {
        if (cancelled) return
        if (d.status === 'error' || !d.values) throw new Error('API error')
        const pts = d.values
          .map((v) => ({ date: new Date(v.datetime), value: parseFloat(v.close) }))
          .reverse()
        setCache((c) => ({ ...c, [active]: pts }))
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [active, cache, hasKey])

  const data = cache[active] ?? FALLBACK_PRICES
  const loading = hasKey && !cache[active] && !failed

  const { points, path, areaPath, yTicks, xTicks } = useMemo(() => {
    const values = data.map((p) => p.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = max - min || 1
    const pts = data.map((p, i) => ({
      x: M.left + (i / (data.length - 1)) * PLOT_W,
      y: M.top + PLOT_H - ((p.value - min) / span) * PLOT_H,
    }))
    const line = pts
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
      .join(' ')
    const ticksY = Array.from({ length: 4 }, (_, i) => {
      const v = min + (span * i) / 3
      return { v, y: M.top + PLOT_H - ((v - min) / span) * PLOT_H }
    })
    const tickIdx = [0, Math.floor((data.length - 1) / 3), Math.floor(((data.length - 1) * 2) / 3), data.length - 1]
    const ticksX = tickIdx.map((i) => ({ label: fmtDate(data[i].date), x: pts[i].x }))
    return {
      points: pts,
      path: line,
      areaPath: `${line} L ${M.left + PLOT_W} ${M.top + PLOT_H} L ${M.left} ${M.top + PLOT_H} Z`,
      yTicks: ticksY,
      xTicks: ticksX,
    }
  }, [data])

  const delta = ((data[data.length - 1].value - data[0].value) / data[0].value) * 100
  const up = delta >= 0
  const last = points[points.length - 1]

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width) * W
    const idx = Math.round(((mx - M.left) / PLOT_W) * (data.length - 1))
    setHover(idx >= 0 && idx < data.length ? idx : null)
  }

  const hoverPt = hover !== null ? points[hover] : null
  const hoverData = hover !== null ? data[hover] : null
  // keep the tooltip inside the plot
  const tipX = hoverPt ? Math.min(Math.max(hoverPt.x, M.left + 70), W - M.right - 70) : 0

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      {/* ticker chips + live readout */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
        <div className="flex gap-1.5">
          {STOCKS.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              aria-pressed={active === s}
              className={`rounded-full px-3 py-1 font-mono text-xs transition-colors ${
                active === s
                  ? 'bg-accent text-white'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="font-mono text-xs text-neutral-500">
          {loading ? (
            <span className="animate-pulse">{t('questChartLoading')}</span>
          ) : (
            <>
              {fmtPrice(data[data.length - 1].value)}{' '}
              <span className={up ? 'text-accent' : 'text-red-400'}>
                {up ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
              </span>
            </>
          )}
        </span>
      </div>

      <div className="px-2 pt-4 pb-1 sm:px-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full cursor-crosshair"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* y-axis grid + labels */}
          {yTicks.map((tk) => (
            <g key={tk.y}>
              <line
                x1={M.left}
                y1={tk.y}
                x2={M.left + PLOT_W}
                y2={tk.y}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.07"
              />
              <text
                x={M.left - 8}
                y={tk.y + 3}
                textAnchor="end"
                className="fill-neutral-400 dark:fill-neutral-600"
                fontSize="11"
                fontFamily="var(--font-mono)"
              >
                {fmtPrice(tk.v)}
              </text>
            </g>
          ))}

          {/* x-axis labels */}
          {xTicks.map((tk, i) => (
            <text
              key={i}
              x={tk.x}
              y={H - 10}
              textAnchor={i === 0 ? 'start' : i === xTicks.length - 1 ? 'end' : 'middle'}
              className="fill-neutral-400 dark:fill-neutral-600"
              fontSize="11"
              fontFamily="var(--font-mono)"
            >
              {tk.label}
            </text>
          ))}

          {/* axes */}
          <line x1={M.left} y1={M.top} x2={M.left} y2={M.top + PLOT_H} stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <line x1={M.left} y1={M.top + PLOT_H} x2={M.left + PLOT_W} y2={M.top + PLOT_H} stroke="currentColor" strokeWidth="1" opacity="0.2" />

          {/* area + price line */}
          <motion.path
            key={`area-${active}-${String(!!cache[active])}`}
            d={areaPath}
            fill="url(#chart-fill)"
            stroke="none"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.path
            key={`line-${active}-${String(!!cache[active])}`}
            d={path}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          {/* latest price dot */}
          {!reduce && !hoverPt && (
            <motion.circle
              cx={last.x}
              cy={last.y}
              r="7"
              fill="var(--color-accent)"
              animate={{ scale: [1, 2, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 1.2 }}
              style={{ transformOrigin: `${last.x}px ${last.y}px` }}
            />
          )}
          {!hoverPt && <circle cx={last.x} cy={last.y} r="4" fill="var(--color-accent)" />}

          {/* hover crosshair + tooltip */}
          {hoverPt && hoverData && (
            <g>
              <line
                x1={hoverPt.x}
                y1={M.top}
                x2={hoverPt.x}
                y2={M.top + PLOT_H}
                stroke="var(--color-accent)"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.5"
              />
              <circle cx={hoverPt.x} cy={hoverPt.y} r="5" fill="var(--color-accent)" />
              <circle cx={hoverPt.x} cy={hoverPt.y} r="9" fill="var(--color-accent)" opacity="0.2" />
              <g>
                <rect
                  x={tipX - 68}
                  y={M.top - 4}
                  width="136"
                  height="36"
                  rx="8"
                  className="fill-neutral-900 dark:fill-neutral-100"
                />
                <text
                  x={tipX}
                  y={M.top + 11}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="var(--font-mono)"
                  className="fill-white dark:fill-neutral-900"
                >
                  {fmtPrice(hoverData.value)}
                </text>
                <text
                  x={tipX}
                  y={M.top + 25}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  className="fill-neutral-400 dark:fill-neutral-500"
                >
                  {hoverData.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      <p className="px-5 pb-3 font-mono text-[10px] text-neutral-400 dark:text-neutral-600">
        {!hasKey ? t('questChartNoKey') : failed ? t('questChartOffline') : t('questChartNote')}
      </p>
    </div>
  )
}

// ------------------------------------------------------------------
// Padel rally — move the racket; if the ball misses it, you lose
// ------------------------------------------------------------------

const RACKET_HIT_RANGE = 15 // in % of court width
const BOUNCE_SECONDS = 0.95

function randTarget() {
  return 14 + Math.random() * 72 // keep the ball inside the court
}

/** A proper tennis ball — emoji fonts sometimes render 🎾 with a racket attached */
function TennisBall() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 drop-shadow-sm" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#d8e24a" stroke="#aab823" strokeWidth="0.8" />
      <path d="M 4.2 4.4 C 9.4 8.8, 9.4 15.2, 4.2 19.6" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 19.8 4.4 C 14.6 8.8, 14.6 15.2, 19.8 19.6" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function PadelRally() {
  const { t } = useApp()
  const [state, setState] = useState<'idle' | 'playing' | 'dropped'>('idle')
  const [count, setCount] = useState(0)
  const [best, setBest] = useState(() => Number(localStorage.getItem('padel-best')) || 0)
  const [racketX, setRacketX] = useState(50)
  const [bounce, setBounce] = useState({ id: 0, from: 50, to: 50 })
  const racketRef = useRef(50)
  const timer = useRef<number>()

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const moveRacket = (clientX: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    const pct = Math.min(92, Math.max(8, ((clientX - rect.left) / rect.width) * 100))
    racketRef.current = pct
    setRacketX(pct)
  }

  const serve = () => {
    if (state !== 'idle') return
    setCount(0)
    setBounce((b) => ({ id: b.id + 1, from: racketRef.current, to: randTarget() }))
    setState('playing')
  }

  const land = () => {
    if (state !== 'playing') return
    if (Math.abs(bounce.to - racketRef.current) < RACKET_HIT_RANGE) {
      // clean hit — rally continues
      const n = count + 1
      setCount(n)
      if (n > best) {
        setBest(n)
        localStorage.setItem('padel-best', String(n))
      }
      setBounce((b) => ({ id: b.id + 1, from: b.to, to: randTarget() }))
    } else {
      // missed the racket — rally lost
      setState('dropped')
      timer.current = window.setTimeout(() => {
        setCount(0)
        setState('idle')
      }, 900)
    }
  }

  return (
    <div className="flex flex-col items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-900">
      <p className="font-mono text-xs text-neutral-500">{t('questRallyTitle')}</p>

      {/* court: everything happens inside this box */}
      <div
        className="relative my-3 h-36 w-full max-w-xs cursor-pointer touch-none overflow-hidden rounded-xl bg-neutral-100/60 select-none dark:bg-neutral-800/40"
        onPointerMove={(e) => moveRacket(e.clientX, e.currentTarget)}
        onPointerDown={(e) => {
          moveRacket(e.clientX, e.currentTarget)
          serve()
        }}
        role="button"
        aria-label={t('questRallyHint')}
      >
        {/* ball */}
        {state === 'playing' ? (
          <motion.div
            key={bounce.id}
            className="absolute bottom-[52px]"
            style={{ translateX: '-50%' }}
            initial={{ left: `${bounce.from}%`, y: 0 }}
            animate={{ left: `${bounce.to}%`, y: [0, -86, 0] }}
            transition={{
              duration: BOUNCE_SECONDS,
              left: { duration: BOUNCE_SECONDS, ease: 'linear' },
              y: { duration: BOUNCE_SECONDS, times: [0, 0.5, 1], ease: ['easeOut', 'easeIn'] },
            }}
            onAnimationComplete={land}
          >
            <TennisBall />
          </motion.div>
        ) : state === 'dropped' ? (
          <motion.div
            key="dropped"
            className="absolute bottom-[52px]"
            style={{ left: `${bounce.to}%`, translateX: '-50%' }}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 60, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeIn' }}
          >
            <TennisBall />
          </motion.div>
        ) : (
          /* idle: ball rests on the racket */
          <motion.div
            className="absolute bottom-[52px]"
            style={{ left: `${racketX}%`, translateX: '-50%' }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <TennisBall />
          </motion.div>
        )}

        {/* racket — follows the pointer */}
        <svg
          viewBox="0 0 90 70"
          className="absolute bottom-1 h-12 w-16 -translate-x-1/2 text-neutral-700 dark:text-neutral-300"
          style={{ left: `${racketX}%` }}
          aria-hidden
        >
          <ellipse cx="45" cy="26" rx="30" ry="22" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="3" />
          {[
            [34, 18], [45, 16], [56, 18],
            [30, 27], [41, 26], [52, 26], [61, 27],
            [36, 35], [47, 35], [57, 34],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2" fill="currentColor" opacity="0.5" />
          ))}
          <rect x="40" y="46" width="10" height="20" rx="4" fill="currentColor" />
        </svg>

        {/* serve prompt / miss flash */}
        {state === 'idle' && (
          <span className="absolute top-3 left-1/2 -translate-x-1/2 animate-pulse font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
            {t('questRallyServe')}
          </span>
        )}
        {state === 'dropped' && (
          <span className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] font-semibold text-red-400">
            {t('questRallyMiss')}
          </span>
        )}
      </div>

      <p className="font-mono text-xs text-neutral-500">
        rally:{' '}
        <span className={state === 'dropped' ? 'font-semibold text-red-400' : 'text-accent font-semibold'}>
          {count}
        </span>{' '}
        · {t('questRallyBest')}: {best}
      </p>
      <p className="mt-2 font-mono text-[10px] text-neutral-400 dark:text-neutral-600">
        {t('questRallyHint')}
      </p>
    </div>
  )
}

// ------------------------------------------------------------------
// Penalty replay — jump back into the shootout
// ------------------------------------------------------------------

function PenaltyReplay({ onReplay }: { onReplay: () => void }) {
  const { t } = useApp()
  return (
    <div className="flex flex-col items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-900">
      <p className="font-mono text-xs text-neutral-500">{t('questReplayTitle')}</p>
      <motion.span
        aria-hidden
        className="my-4 text-5xl select-none"
        animate={{ rotate: [0, 12, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        ⚽
      </motion.span>
      <button
        onClick={onReplay}
        className="hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 font-mono text-xs transition-colors dark:border-neutral-700"
      >
        <RotateCcw size={13} /> {t('questReplayBtn')}
      </button>
    </div>
  )
}

// ------------------------------------------------------------------

export function SideQuests({ onReplay }: { onReplay: () => void }) {
  const { t } = useApp()
  return (
    <section id="quests" className="mx-auto max-w-5xl px-6 py-20">
      <p className="font-mono text-xs text-neutral-400 dark:text-neutral-600">
        <span className="text-accent">{'// '}</span>
        {t('marketCaption')}
      </p>

      <div className="mt-6 grid gap-4">
        <MarketChart />
        <div className="grid gap-4 sm:grid-cols-2">
          <PadelRally />
          <PenaltyReplay onReplay={onReplay} />
        </div>
      </div>
    </section>
  )
}
