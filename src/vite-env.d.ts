/// <reference types="vite/client" />

// safe to expose (read-only, public-data, rate-limited free tiers).
// note to self: never add secrets (e.g. the Last.fm shared secret, OAuth secrets, DB creds).
interface ImportMetaEnv {
  readonly VITE_TWELVEDATA_API_KEY?: string
  readonly VITE_LASTFM_USERNAME?: string
  readonly VITE_LASTFM_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
