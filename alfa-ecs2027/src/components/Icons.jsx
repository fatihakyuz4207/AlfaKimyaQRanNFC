export function Icon({ name, className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
      {name === 'industrial' && (
        <>
          <path d="M3 20h18" strokeLinecap="round" />
          <path d="M4 20V10l5 3V10l5 3V6h6v14" strokeLinejoin="round" />
        </>
      )}
      {name === 'architectural' && (
        <>
          <path d="M4 20h16" strokeLinecap="round" />
          <path d="M6 20V8l6-4 6 4v12" strokeLinejoin="round" />
          <path d="M10 20v-5h4v5" />
        </>
      )}
      {name === 'wood' && (
        <>
          <path d="M5 7h14v12H5z" />
          <path d="M8 7c1 2 1 8 0 12M12 7c1 2 1 8 0 12M16 7c1 2 1 8 0 12" />
        </>
      )}
      {name === 'shield' && <path d="M12 3 5 6v6c0 4.2 2.8 6.8 7 8 4.2-1.2 7-3.8 7-8V6l-7-3z" strokeLinejoin="round" />}
      {name === 'arrow' && <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />}
      {name === 'back' && <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />}
      {name === 'cart' && (
        <>
          <path d="M6 7h14l-1.2 8.2a2 2 0 0 1-2 1.8H9.1a2 2 0 0 1-2-1.7L5.2 4H3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 20.5h.01M17 20.5h.01" strokeLinecap="round" />
        </>
      )}
      {name === 'download' && <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" strokeLinecap="round" strokeLinejoin="round" />}
      {name === 'close' && <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />}
      {name === 'check' && <path d="m5 12 5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />}
      {name === 'play' && <path d="m9 7 8 5-8 5V7z" strokeLinejoin="round" />}
    </svg>
  )
}
