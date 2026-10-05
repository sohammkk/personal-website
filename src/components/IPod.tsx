import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Music2, SkipBack, SkipForward, Play } from 'lucide-react'
import { useApp } from '../AppContext'
import { site } from '../content'

interface Track {
  name: string
  artist: string
  album?: string
  image?: string
  nowPlaying: boolean
}

const DEMO_TRACK: Track = {
  name: 'Set up the Last.fm key',
  artist: 'to show Apple Music plays',
  nowPlaying: false,
}

// Last.fm's default "no artwork" placeholder image (a gray star icon).
// When this hash shows up, treat it the same as a missing image.
const LASTFM_PLACEHOLDER_HASH = '2a96cbd8b46e442fc41c2b86b821562f'

function isUsableImage(url?: string): url is string {
  return !!url && !url.includes(LASTFM_PLACEHOLDER_HASH)
}

/** Last.fm no longer serves real cover art, so fall back to iTunes' free, key-less search API. */
async function fetchItunesArtwork(artist: string, track: string): Promise<string | undefined> {
  try {
    const term = encodeURIComponent(`${artist} ${track}`)
    const url = `https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=1`
    const res = await fetch(url)
    if (!res.ok) return undefined
    const data = await res.json()
    const artwork: string | undefined = data?.results?.[0]?.artworkUrl100
    // Request a larger image than the default 100x100 thumbnail.
    return artwork?.replace('100x100bb', '300x300bb')
  } catch {
    return undefined
  }
}

async function fetchTrack(): Promise<Track | null> {
  const { username, apiKey } = site.lastfm
  if (!username || !apiKey) return null
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
    username,
  )}&api_key=${encodeURIComponent(apiKey)}&format=json&limit=1`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  const raw = data?.recenttracks?.track?.[0]
  if (!raw) return null

  const name = raw.name
  const artist = raw.artist?.['#text'] ?? ''
  let image = raw.image?.find((i: { size: string }) => i.size === 'extralarge')?.['#text']
  if (!isUsableImage(image)) {
    image = await fetchItunesArtwork(artist, name)
  }

  return {
    name,
    artist,
    album: raw.album?.['#text'],
    image,
    nowPlaying: raw['@attr']?.nowplaying === 'true',
  }
}

/** Animated equalizer bars */
function Equalizer({ playing }: { playing: boolean }) {
  const reduce = useReducedMotion()
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden>
      {[0.9, 0.5, 1, 0.7].map((h, i) => (
        <motion.span
          key={i}
          className="bg-accent w-0.5 rounded-full"
          animate={
            playing && !reduce
              ? { height: [`${h * 40}%`, `${h * 100}%`, `${h * 40}%`] }
              : { height: '30%' }
          }
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
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
  const [track, setTrack] = useState<Track>(DEMO_TRACK)
  const [bursts, setBursts] = useState<NoteBurst[]>([])
  const burstId = useRef(0)

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

  useEffect(() => {
    let active = true
    const load = () => {
      fetchTrack()
        .then((tr) => {
          if (active && tr) setTrack(tr)
        })
        .catch(() => {})
    }
    load()
    const id = setInterval(load, 60_000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  return (
    <div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        whileHover={reduce ? undefined : { rotate: 1.5, scale: 1.02 }}
        onHoverStart={popNotes}
        onTap={popNotes}
        className="relative mx-auto w-64 cursor-pointer rounded-[2rem] border border-neutral-300 bg-gradient-to-b from-white to-neutral-200 p-5 shadow-xl select-none dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-900"
      >
        <NoteBurst bursts={bursts} />
      {/* Screen */}
      <div className="rounded-lg border border-neutral-400/40 bg-neutral-100 p-3 dark:bg-neutral-950">
        <div className="mb-2 flex items-center justify-between text-[10px] font-semibold tracking-wide text-neutral-500 uppercase">
          <span className="flex items-center gap-1">
            <Music2 size={10} />
            {track.nowPlaying ? t('nowPlaying') : t('lastPlayed')}
          </span>
          <Equalizer playing={track.nowPlaying} />
        </div>
        <div className="flex items-center gap-3">
          {track.image ? (
            <img src={track.image} alt="" className="h-12 w-12 rounded-md object-cover" />
          ) : (
            <div className="bg-accent/15 text-accent flex h-12 w-12 items-center justify-center rounded-md">
              <Music2 size={20} />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{track.name}</p>
            <p className="truncate text-xs text-neutral-500">{track.artist}</p>
          </div>
        </div>
        {/* progress bar */}
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-300 dark:bg-neutral-800">
          <motion.div
            className="bg-accent h-full"
            animate={track.nowPlaying && !reduce ? { width: ['15%', '85%'] } : { width: '40%' }}
            transition={{ duration: 30, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>
      </div>

      {/* Click wheel */}
      <div className="click-wheel relative mx-auto mt-5 flex h-36 w-36 items-center justify-center rounded-full shadow-inner">
        <span className="absolute top-2.5 text-[9px] font-bold tracking-widest text-neutral-500">MENU</span>
        <SkipBack size={13} className="absolute left-3 text-neutral-500" />
        <SkipForward size={13} className="absolute right-3 text-neutral-500" />
        <Play size={13} className="absolute bottom-3 text-neutral-500" />
        <div className="h-12 w-12 rounded-full bg-white shadow dark:bg-neutral-700" />
      </div>
      </motion.div>
      <p className="mt-3 text-center font-mono text-[11px] tracking-wide text-neutral-400 dark:text-neutral-600">
        {t('ipodHoverHint')}
      </p>
    </div>
  )
}
