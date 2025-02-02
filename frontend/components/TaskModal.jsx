// frontend/components/TaskModal.jsx
import { useState } from "react";

const colors = [
    "bg-gray-200",
    "bg-red-200",
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-indigo-200",
    "bg-purple-200",
  ]

export default function TaskModal({ task, isOpen, onClose, updateTask }) {
  const [content, setContent] = useState(task.content);
  const [color, setColor] = useState(task.color || "bg-gray-200");

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTask(task.id, content, color);
    onClose();
  };

  if (!isOpen) return null;

return (
    <div className={`fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`p-6 rounded-xl shadow-lg w-3/4 ${color} transform transition-transform duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={handleSubmit} className={`flex flex-col space-y-4 transform transition-transform duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border rounded-xl p-2"
                    placeholder="Task Name"
                />
                <div className="flex space-x-2">
                    {colors.map((c) => (
                        <button
                            key={c}
                            type="button"
                            className={`w-6 h-6 rounded-full ${c} ${color === c ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
                            onClick={() => setColor(c)}
                        />
                    ))}
                </div>
                {/* Future features like chatbot textbox and drag and drop contributor list can be added here */}
                <div className="flex justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full">
                        Save
                    </button>
                    <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
);
}