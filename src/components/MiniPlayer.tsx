import { AnimatePresence, motion } from 'framer-motion'
import { Music2, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { usePlayer } from '../PlayerContext'

/** Compact fixed player shown on the CV page and once the iPod is scrolled past. */
export function MiniPlayer() {
  const { track, image, playing, progress, togglePlay, skip, ipodPassed } = usePlayer()
  const btn = 'hover:text-accent cursor-pointer p-1.5 text-neutral-500 transition-colors'

  return (
    <AnimatePresence>
      {ipodPassed && track && (
        <motion.div
          key="mini-player"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3 }}
          className="fixed right-4 bottom-4 z-40 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-neutral-300 bg-white/90 shadow-lg backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/90"
        >
          <div className="flex items-center gap-3 p-2.5">
            {image ? (
              <img src={image} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
            ) : (
              <div className="bg-accent/15 text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
                <Music2 size={16} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm leading-tight font-semibold">{track.title}</p>
              <p className="truncate text-xs text-neutral-500">{track.artist}</p>
            </div>
            <div className="flex items-center">
              <button type="button" onClick={() => skip(-1)} aria-label="Previous" className={btn}>
                <SkipBack size={14} />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? 'Pause' : 'Play'}
                className={btn}
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button type="button" onClick={() => skip(1)} aria-label="Next" className={btn}>
                <SkipForward size={14} />
              </button>
            </div>
          </div>
          <div className="h-0.5 bg-neutral-200 dark:bg-neutral-800">
            <div className="bg-accent h-full" style={{ width: `${progress * 100}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
