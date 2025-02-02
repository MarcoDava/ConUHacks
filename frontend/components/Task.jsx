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
            className={`${task.color} p-4 px-6 mb-2 rounded shadow border-2 border-gray-300`}
          >
            <div className="flex justify-between items-center">
              <span className="mr-4">{task.content}</span>
              <div className="flex space-x-2 items-center">
                {task.assignedMember && (
                  <div className="relative group">
                    <img
                      src={task.assignedMember.image}
                      alt={task.assignedMember.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {task.assignedMember.name}
                    </span>
                  </div>
                )}
                <button onClick={() => setIsModalOpen(true)} className="text-gray-200 bg-blue-400 hover:bg-blue-600 transition duration-300 border px-3 py-1.5 rounded-full">
                  View
                </button>
                <button onClick={() => deleteTask(task.id)} className="text-gray-200 bg-red-500 hover:bg-red-700 transition duration-300 border px-3 py-1.5 rounded-full">
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
