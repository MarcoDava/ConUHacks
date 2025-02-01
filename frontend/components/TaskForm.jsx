"use client"

import { useState } from "react"

export default function TaskForm({ onSubmit }) {
  const [content, setContent] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content)
      setContent("")
    }
  }

  return (
    (<form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a new task"
        className="border rounded p-2 mr-2" />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add Task
      </button>
    </form>)
  );
}

