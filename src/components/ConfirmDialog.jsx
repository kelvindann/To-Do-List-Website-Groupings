import { useEffect, useRef } from 'react'
import Icon from './Icon.jsx'

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const trigger = document.activeElement
    dialog.showModal()
    return () => {
      dialog.close()
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog ref={dialogRef} aria-labelledby="confirmation-title" aria-describedby="confirmation-message" onCancel={event => { event.preventDefault(); onCancel() }} onClick={event => { if (event.target === event.currentTarget) onCancel() }} className="confirmation-dialog">
      <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600"><Icon name="trash" size={24} /></div>
      <h2 id="confirmation-title" className="mb-3 text-xl font-semibold tracking-tight">{title}</h2>
      <p id="confirmation-message" className="break-words text-sm leading-6 text-slate-600 [overflow-wrap:anywhere]">{message}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
        <button type="button" onClick={onCancel} className="button-secondary">Cancel</button>
        <button type="button" onClick={onConfirm} className="button-danger"><Icon name="trash" size={15} />{confirmLabel}</button>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
