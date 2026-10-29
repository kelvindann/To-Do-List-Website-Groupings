import { useEffect, useRef } from 'react'

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => dialog.close()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-message"
      onCancel={event => {
        event.preventDefault()
        onCancel()
      }}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-sm rounded-lg border border-blue-200 border-t-4 border-t-purple-400 bg-white p-6 text-slate-800 shadow-lg backdrop:bg-indigo-950/30"
    >
      <h2 id="confirmation-title" className="mb-2 text-lg font-semibold">{title}</h2>
      <p id="confirmation-message" className="text-sm leading-6 text-slate-600">{message}</p>
      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <button type="button" autoFocus onClick={onCancel} className="button-secondary">Cancel</button>
        <button type="button" onClick={onConfirm} className="button-danger">{confirmLabel}</button>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
