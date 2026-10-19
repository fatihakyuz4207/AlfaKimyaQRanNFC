import { useEffect, useState } from 'react'
import { track } from '../lib/analytics.js'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function VideoLoop({ productId, tone }) {
  const [reduced] = useState(prefersReducedMotion)
  const [playing, setPlaying] = useState(!prefersReducedMotion())

  useEffect(() => {
    if (!playing) return undefined
    track('video_start', { product: productId, key: `vstart:${productId}` })
    const node = document.getElementById(`loop-${productId}`)
    const film = node?.querySelector('.loop-film')
    if (!film) return undefined
    const done = () => {
      track('video_complete', { product: productId, key: `vdone:${productId}` })
      film.removeEventListener('animationiteration', done)
    }
    film.addEventListener('animationiteration', done)
    return () => film.removeEventListener('animationiteration', done)
  }, [playing, productId])

  return (
    <figure>
      <div
        id={`loop-${productId}`}
        className={`loop ${tone === 'water' ? 'is-water' : 'is-solid'} ${playing ? 'is-playing' : ''}`}
        role="img"
        aria-label="Silent eight second coating application loop"
      >
        <div className="loop-panel" />
        <div className="loop-film" />
        <div className="loop-tool" />
        <div className="loop-progress" />
      </div>
      <figcaption className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>Silent application loop · 8 seconds</span>
        {reduced && !playing ? (
          <button type="button" className="font-semibold text-alfa" onClick={() => setPlaying(true)}>
            Play
          </button>
        ) : (
          <span>Autoplay</span>
        )}
      </figcaption>
    </figure>
  )
}
