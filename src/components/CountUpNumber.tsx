import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function prefersRidottoMovimento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/** Anima un numero dal suo valore corrente al nuovo target ogni volta che `target` cambia,
 * senza librerie esterne (solo requestAnimationFrame). Rispetta prefers-reduced-motion. */
function useCountUp(target: number, durationMs: number): number {
  const [display, setDisplayState] = useState(target)
  const displayRef = useRef(target)
  const frameRef = useRef<number | undefined>(undefined)

  const setDisplay = (v: number) => {
    displayRef.current = v
    setDisplayState(v)
  }

  useEffect(() => {
    if (prefersRidottoMovimento()) {
      setDisplay(target)
      return
    }

    const from = displayRef.current
    const delta = target - from
    if (delta === 0) return

    const start = performance.now()

    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs)
      setDisplay(from + delta * easeOutCubic(t))
      if (t < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs])

  return display
}

interface CountUpNumberProps {
  value: number
  format: (n: number) => string
  durationMs?: number
  className?: string
}

export function CountUpNumber({ value, format, durationMs = 900, className }: CountUpNumberProps) {
  const display = useCountUp(value, durationMs)
  return <span className={className}>{format(display)}</span>
}
