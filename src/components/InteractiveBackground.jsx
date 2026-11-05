import { useEffect, useRef } from 'react'

export default function InteractiveBackground() {
  const backgroundRef = useRef(null)

  useEffect(() => {
    const background = backgroundRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let frame = null
    let pointerX = 0
    let pointerY = 0

    function paint() {
      frame = null
      background.style.setProperty('--pointer-x', `${pointerX}px`)
      background.style.setProperty('--pointer-y', `${pointerY}px`)
      background.style.setProperty('--pointer-visible', '1')
    }

    function reset() {
      if (frame !== null) window.cancelAnimationFrame(frame)
      frame = null
      background.style.setProperty('--pointer-visible', '0')
    }

    function handlePointerMove(event) {
      if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return
      pointerX = event.clientX
      pointerY = event.clientY
      // Update the decorative layer once per frame without rerendering the app.
      if (frame === null) frame = window.requestAnimationFrame(paint)
    }

    function handlePointerOut(event) {
      if (event.relatedTarget === null) reset()
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerout', handlePointerOut, { passive: true })
    window.addEventListener('blur', reset)
    reducedMotion.addEventListener('change', reset)
    finePointer.addEventListener('change', reset)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerout', handlePointerOut)
      window.removeEventListener('blur', reset)
      reducedMotion.removeEventListener('change', reset)
      finePointer.removeEventListener('change', reset)
      reset()
    }
  }, [])

  return <div ref={backgroundRef} className="interactive-background" aria-hidden="true" />
}
