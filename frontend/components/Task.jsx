"use client"

import { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"
import TaskModal from "./TaskModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${task.color} p-4 px-6 mb-2 rounded shadow`}
          >
            <div className="flex justify-between items-center">
              <span className="mr-4">{task.content}</span>
              <div className="flex space-x-2">
                <button onClick={() => setIsModalOpen(true)} className="text-gray-200 bg-blue-600 hover:bg-blue-700 border px-3 py-1 rounded-lg">
                  Edit
                </button>
                <button onClick={() => deleteTask(task.id)} className="text-gray-200 bg-red-700 hover:bg-red-800 border px-3 py-1 rounded-lg">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>
      <TaskModal
        task={task}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        updateTask={updateTask}
      />
    </>
  );
}
