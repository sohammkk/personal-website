import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Music2, SkipBack, SkipForward, Play, Pause } from 'lucide-react'
import { useApp } from '../AppContext'
import { usePlayer } from '../PlayerContext'

/** Formats seconds as m:ss */
function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Animated equalizer bars */
function Equalizer({ playing }: { playing: boolean }) {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden>
      {[0.9, 0.5, 1, 0.7].map((h, i) => (
        <motion.span
          key={i}
          className="bg-accent w-0.5 rounded-full"
          animate={
            playing
              ? { height: [`${h * 40}%`, `${h * 100}%`, `${h * 40}%`] }
              : { height: '30%' }
          }
          transition={
            playing
              ? { duration: 0.7, repeat: Infinity, delay: i * 0.12 }
              : { duration: 0.2 }
          }
        />
      ))}
    </span>
  )
}

const NOTE_CHARS = ['♪', '♫', '♩', '♬']

interface NoteBurst {
  id: number
  char: string
  x: number
}

/** A handful of minimalistic notes that pop up and fade when the iPod is clicked */
function NoteBurst({ bursts }: { bursts: NoteBurst[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.span
            key={b.id}
            className="text-accent absolute top-1/2 left-1/2 text-xl"
            initial={{ opacity: 0, y: 0, x: b.x, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], y: -70, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          >
            {b.char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function IPod() {
  const { t } = useApp()
  const reduce = useReducedMotion()
  const [bursts, setBursts] = useState<NoteBurst[]>([])
  const burstId = useRef(0)
  const { tracks, index, track, image, playing, progress, time, missing, play, togglePlay, skip, seek, setIpodPassed } =
    usePlayer()
  const [menuOpen, setMenuOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  // Tell the mini player when the iPod has been scrolled past (or is not on screen at all).
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      setIpodPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      setIpodPassed(true)
    }
  }, [setIpodPassed])

  const popNotes = () => {
    if (reduce) return
    const count = 3 + Math.floor(Math.random() * 2) // 3-4 notes
    const fresh: NoteBurst[] = Array.from({ length: count }, () => {
      burstId.current += 1
      return {
        id: burstId.current,
        char: NOTE_CHARS[Math.floor(Math.random() * NOTE_CHARS.length)],
        x: (Math.random() - 0.5) * 70,
      }
    })
    setBursts((prev) => [...prev, ...fresh])
    const ids = fresh.map((f) => f.id)
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((b) => !ids.includes(b.id)))
    }, 1200)
  }

  const step = (dir: 1 | -1) => {
    const n = tracks.length
    if (menuOpen) setHighlight((h) => (h + dir + n) % n)
    else skip(dir)
  }

  const openMenu = () => {
    setHighlight(index)
    setMenuOpen((o) => !o)
  }

  const select = () => {
    if (menuOpen) {
      setMenuOpen(false)
      play(highlight)
    } else {
      togglePlay()
    }
  }

  if (!track) return null

  const wheelBtn = 'absolute text-xs font-bold tracking-widest text-neutral-500 hover:text-accent cursor-pointer'

  return (
    <div ref={rootRef}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        whileHover={reduce ? undefined : { rotate: 1.5, scale: 1.02 }}
        onHoverStart={popNotes}
        className="relative mx-auto w-80 rounded-[2.5rem] border border-neutral-300 bg-gradient-to-b from-white to-neutral-200 p-5 shadow-xl select-none dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-900"
      >
        <NoteBurst bursts={bursts} />
      {/* Screen */}
      <div className="h-[13.5rem] rounded-lg border border-neutral-400/40 bg-neutral-100 p-4 dark:bg-neutral-950">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold tracking-wide text-neutral-500 uppercase">
          <span className="flex items-center gap-1.5">
            <Music2 size={12} />
            {menuOpen ? t('ipodMenuTitle') : playing ? t('nowPlaying') : t('paused')}
          </span>
          <Equalizer playing={playing} />
        </div>
        {menuOpen ? (
          <ul className="space-y-0.5">
            {tracks.map((tr, i) => (
              <li key={tr.file}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => {
                    setMenuOpen(false)
                    play(i)
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between rounded px-2 py-1 text-left text-sm ${
                    i === highlight ? 'bg-accent text-white' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <span className="truncate">
                    {tr.title}
                    <span className={`text-xs ${i === highlight ? 'text-white/80' : 'text-neutral-500'}`}>
                      {' - '}
                      {tr.artist}
                    </span>
                  </span>
                  {i === index && playing && <span aria-hidden>♪</span>}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <div className="flex items-center gap-4">
              {image ? (
                <img src={image} alt="" className="h-16 w-16 rounded-md object-cover" />
              ) : (
                <div className="bg-accent/15 text-accent flex h-16 w-16 items-center justify-center rounded-md">
                  <Music2 size={24} />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-base font-semibold">{track.title}</p>
                <p className="truncate text-sm text-neutral-500">{track.artist}</p>
              </div>
            </div>
            {missing && <p className="mt-2 text-xs text-red-500">{t('ipodMissing')}</p>}
            {/* progress bar: click anywhere on it to jump to that position */}
            <button
              type="button"
              aria-label="Seek"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                seek((e.clientX - rect.left) / rect.width)
              }}
              className="mt-3 block w-full cursor-pointer py-2"
            >
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-300 dark:bg-neutral-800">
                <div className="bg-accent h-full" style={{ width: `${progress * 100}%` }} />
              </div>
            </button>
            <div className="flex justify-between font-mono text-xs text-neutral-500 tabular-nums">
              <span>{formatTime(time.current)}</span>
              <span>{time.duration ? formatTime(time.duration) : '--:--'}</span>
            </div>
          </>
        )}
      </div>

      {/* Click wheel */}
      <div className="click-wheel relative mx-auto mt-6 flex h-44 w-44 items-center justify-center rounded-full shadow-inner">
        <button type="button" onClick={openMenu} aria-label="Menu" className={`${wheelBtn} top-3 px-2 py-1`}>
          MENU
        </button>
        <button type="button" onClick={() => step(-1)} aria-label="Previous" className={`${wheelBtn} left-3 p-1`}>
          <SkipBack size={16} />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next" className={`${wheelBtn} right-3 p-1`}>
          <SkipForward size={16} />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
          className={`${wheelBtn} bottom-3 p-1`}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          type="button"
          onClick={select}
          aria-label="Select"
          className="h-16 w-16 cursor-pointer rounded-full bg-white shadow dark:bg-neutral-700"
        />
      </div>
      </motion.div>
      <p className="mt-3 text-center font-mono text-[11px] leading-relaxed tracking-wide whitespace-pre-line text-neutral-400 dark:text-neutral-600">
        {t('ipodHoverHint')}
      </p>
    </div>
  )
}
