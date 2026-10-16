import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { site } from './content'

const fallbackTracks = site.ipodTracks

export type PlayerTrack = (typeof fallbackTracks)[number]

interface LastfmMeta {
  title: string
  artist: string
  image?: string
}

// Last.fm's default "no artwork" placeholder image (a gray star icon).
const LASTFM_PLACEHOLDER_HASH = '2a96cbd8b46e442fc41c2b86b821562f'

/** The user's most recent scrobbles (newest first), used for song metadata. */
async function fetchRecentTracks(limit: number): Promise<LastfmMeta[]> {
  const { username, apiKey } = site.lastfm
  if (!username || !apiKey) return []
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
      username,
    )}&api_key=${encodeURIComponent(apiKey)}&format=json&limit=${limit}`
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    const raw: unknown[] = data?.recenttracks?.track ?? []
    return raw.slice(0, limit).map((r) => {
      const tr = r as {
        name: string
        artist?: { '#text'?: string }
        image?: { size: string; '#text': string }[]
      }
      const image = tr.image?.find((i) => i.size === 'extralarge')?.['#text']
      return {
        title: tr.name,
        artist: tr.artist?.['#text'] ?? '',
        image: image && !image.includes(LASTFM_PLACEHOLDER_HASH) ? image : undefined,
      }
    })
  } catch {
    return []
  }
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')

/**
 * Cover art lookup via iTunes' free, key-less search API.
 * Only accepts a result whose title and artist actually match, so a fuzzy
 * search hit never shows the wrong album.
 */
async function fetchItunesArtwork(artist: string, track: string): Promise<string | undefined> {
  try {
    const term = encodeURIComponent(`${artist} ${track}`)
    const url = `https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=15`
    const res = await fetch(url)
    if (!res.ok) return undefined
    const data = await res.json()
    const wantTitle = norm(track)
    const wantArtist = norm(artist)
    const hit = (data?.results ?? []).find(
      (r: { trackName?: string; artistName?: string }) => {
        const title = norm(r.trackName ?? '')
        const art = norm(r.artistName ?? '')
        return (
          wantTitle.length > 0 &&
          (title === wantTitle || title.startsWith(wantTitle)) &&
          (art.includes(wantArtist) || wantArtist.includes(art))
        )
      },
    )
    const artwork: string | undefined = hit?.artworkUrl100
    // Request a larger image than the default 100x100 thumbnail.
    return artwork?.replace('100x100bb', '300x300bb')
  } catch {
    return undefined
  }
}

interface PlayerValue {
  tracks: PlayerTrack[]
  index: number
  track: PlayerTrack | undefined
  image: string | undefined
  playing: boolean
  progress: number
  time: { current: number; duration: number }
  missing: boolean
  play: (i: number) => void
  togglePlay: () => void
  skip: (dir: 1 | -1) => void
  /** Jump to a fraction (0-1) of the current song and start playing from there. */
  seek: (fraction: number) => void
  /** True once the iPod is scrolled out above the viewport, or isn't on the page (CV). */
  ipodPassed: boolean
  setIpodPassed: (v: boolean) => void
}

const PlayerContext = createContext<PlayerValue | null>(null)

/**
 * Owns the <audio> element at the app root, so music keeps playing
 * when navigating between pages (e.g. home -> CV).
 */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const wantPlay = useRef(false)
  const [index, setIndex] = useState(() => Math.floor(Math.random() * fallbackTracks.length))
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [time, setTime] = useState({ current: 0, duration: 0 })
  const [missing, setMissing] = useState(false)
  const [ipodPassed, setIpodPassed] = useState(true)
  const [artwork, setArtwork] = useState<Record<string, string | undefined>>({})
  const [tracks, setTracks] = useState(fallbackTracks)
  const [lastfmImages, setLastfmImages] = useState<(string | undefined)[]>([])

  const track = tracks[index]
  const image = track ? (artwork[`${track.artist}|${track.title}`] ?? lastfmImages[index]) : undefined

  // Song metadata from Last.fm: slot N of the recent scrobbles maps to the Nth mp3.
  useEffect(() => {
    let active = true
    fetchRecentTracks(fallbackTracks.length).then((recent) => {
      if (!active || recent.length === 0) return
      setTracks(
        fallbackTracks.map((fb, i) =>
          recent[i] ? { ...fb, title: recent[i].title, artist: recent[i].artist } : fb,
        ),
      )
      setLastfmImages(recent.map((r) => r.image))
    })
    return () => {
      active = false
    }
  }, [])

  // Cover art via iTunes.
  useEffect(() => {
    let active = true
    tracks.forEach((tr) => {
      const key = `${tr.artist}|${tr.title}`
      fetchItunesArtwork(tr.artist, tr.title).then((url) => {
        if (active && url) setArtwork((prev) => ({ ...prev, [key]: url }))
      })
    })
    return () => {
      active = false
    }
  }, [tracks])

  // Start playback after a track change (src is updated by the time effects run).
  useEffect(() => {
    setProgress(0)
    setTime({ current: 0, duration: 0 })
    setMissing(false)
    if (wantPlay.current) audioRef.current?.play().catch(() => {})
  }, [index])

  const play = (i: number) => {
    wantPlay.current = true
    if (i === index) {
      const a = audioRef.current
      if (a?.ended) a.currentTime = 0
      a?.play().catch(() => {})
    } else {
      setIndex(i)
    }
  }

  const togglePlay = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) play(index)
    else {
      wantPlay.current = false
      a.pause()
    }
  }

  const skip = (dir: 1 | -1) => {
    const n = tracks.length
    play((index + dir + n) % n)
  }

  const seek = (fraction: number) => {
    const a = audioRef.current
    if (!a || !Number.isFinite(a.duration) || a.duration <= 0) return
    a.currentTime = Math.min(Math.max(fraction, 0), 1) * a.duration
    wantPlay.current = true
    a.play().catch(() => {})
  }

  return (
    <PlayerContext.Provider
      value={{
        tracks,
        index,
        track,
        image,
        playing,
        progress,
        time,
        missing,
        play,
        togglePlay,
        skip,
        seek,
        ipodPassed,
        setIpodPassed,
      }}
    >
      {track && (
        <audio
          ref={audioRef}
          src={track.file}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => {
            setMissing(true)
            setPlaying(false)
          }}
          onLoadedMetadata={(e) => setTime({ current: 0, duration: e.currentTarget.duration || 0 })}
          onTimeUpdate={(e) => {
            const { currentTime, duration } = e.currentTarget
            setProgress(duration ? currentTime / duration : 0)
            setTime({ current: currentTime, duration: Number.isFinite(duration) ? duration : 0 })
          }}
          onEnded={() => skip(1)}
        />
      )}
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
