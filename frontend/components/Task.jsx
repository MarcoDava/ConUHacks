"use client"

import { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"

const colors = [
  "bg-gray-200",
  "bg-red-200",
  "bg-yellow-200",
  "bg-green-200",
  "bg-blue-200",
  "bg-indigo-200",
  "bg-purple-200",
]

export default function Task({ task, index, updateTask, deleteTask }) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(task.content)
  const [color, setColor] = useState(task.color || "bg-gray-200")

  const handleSubmit = (e) => {
    e.preventDefault()
    updateTask(task.id, content, color)
    setIsEditing(false)
  }

  return (
    (<Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${color} p-4 mb-2 rounded shadow`}>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border rounded p-1" />
              <div className="flex space-x-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`w-6 h-6 rounded-full ${c} ${color === c ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
                    onClick={() => setColor(c)} />
                ))}
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 px-2 py-1 rounded text-sm">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <span>{task.content}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-600 hover:text-blue-500">
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-600 hover:text-red-500">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>)
  );
}

