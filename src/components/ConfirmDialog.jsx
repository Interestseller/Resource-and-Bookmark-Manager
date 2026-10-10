import Modal from './Modal'
export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Are you sure?" onClose={onCancel}>
      <p className="mb-4 text-sm">{message}</p>
      <div className="flex justify-end gap-2">
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn !bg-red-600" onClick={onConfirm}>Delete</button>
      </div>
    </Modal>
  )
}
