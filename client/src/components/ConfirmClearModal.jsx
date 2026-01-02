import Modal from "./Modal";

export function ConfirmClearModal({ onClose, message, title }) {
  return (
    <Modal visible={true}>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onClose(true)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
}
