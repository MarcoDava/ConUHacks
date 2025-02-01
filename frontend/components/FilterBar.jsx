"use client"

import { useState } from "react"

export default function FilterBar({ setFilter }) {
  const [filterText, setFilterText] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setFilter(filterText)
  }

  return (
    (<form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        placeholder="Filter tasks"
        className="border rounded p-2 mr-2" />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Filter
      </button>
    </form>)
  );
}

