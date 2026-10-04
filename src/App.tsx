import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { PenaltyGame } from './components/PenaltyGame'
import { SideQuests } from './components/SideQuests'
import { CvPage } from './components/CvPage'
import { About, CvCta, Footer } from './components/Sections'

type Route = 'home' | 'cv'

function routeFromHash(): Route {
  return window.location.hash.startsWith('#/cv') ? 'cv' : 'home'
}

export default function App() {
  const [route, setRoute] = useState<Route>(routeFromHash)
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem('pk-unlocked') === '1',
  )

  useEffect(() => {
    const onHash = () => {
      setRoute((prev) => {
        const next = routeFromHash()
        if (next !== prev) window.scrollTo(0, 0)
        return next
      })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // The penalty gate only locks the home page, the CV stays reachable for people in a hurry.
  const gated = route === 'home' && !unlocked

  useEffect(() => {
    document.body.style.overflow = gated ? 'hidden' : ''
    if (unlocked) sessionStorage.setItem('pk-unlocked', '1')
  }, [gated, unlocked])

  const replay = () => {
    sessionStorage.removeItem('pk-unlocked')
    setUnlocked(false)
  }

  return (
    <>
      <AnimatePresence>
        {gated && (
          <motion.div
            key="penalty-gate"
            className="fixed inset-0 z-[100]"
            exit={{ opacity: 0, y: '-8%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <PenaltyGame onUnlock={() => setUnlocked(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Nav route={route} />
      {route === 'home' ? (
        <main>
          <Hero />
          <About />
          <SideQuests onReplay={replay} />
          <CvCta />
        </main>
      ) : (
        <CvPage />
      )}
      <Footer onReplay={route === 'home' ? replay : undefined} />
    </>
  )
}
