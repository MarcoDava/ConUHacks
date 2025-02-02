"use client"

import { useState } from "react"
import { DragDropContext } from "@hello-pangea/dnd"
import Column from "./Column"
import TaskForm from "./TaskForm"
import FilterBar from "./FilterBar"

const initialData = {
  tasks: {
    "task-1": { id: "task-1", content: "Take out the trash", color: "bg-blue-200" },
    "task-2": { id: "task-2", content: "Grocery shopping", color: "bg-green-200" },
    "task-3": { id: "task-3", content: "Pay bills", color: "bg-yellow-200" },
    "task-4": { id: "task-4", content: "Walk the dog", color: "bg-pink-200" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      taskIds: ["task-1", "task-2", "task-3"],
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      taskIds: ["task-4"],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
}

export default function KanbanBoard() {
  const [board, setBoard] = useState(initialData);
  const [filter, setFilter] = useState("");

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    const start = board.columns[source.droppableId];
    const finish = board.columns[destination.droppableId];
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
      const newBoard = {
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      };
      setBoard(newBoard);
      return;
    }
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };
    const newBoard = {
      ...board,
      columns: {
        ...board.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setBoard(newBoard);
  };

  const addTask = (content) => {
    const newTaskId = `task-${Object.keys(board.tasks).length + 1}`;
    const newTask = {
      id: newTaskId,
      content,
      color: "bg-gray-200",
    };
    const newBoard = {
      ...board,
      tasks: {
        ...board.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...board.columns,
        "column-1": {
          ...board.columns["column-1"],
          taskIds: [...board.columns["column-1"].taskIds, newTaskId],
        },
      },
    };
    setBoard(newBoard);
  };

  const updateTask = (taskId, newContent, newColor) => {
    const newBoard = {
      ...board,
      tasks: {
        ...board.tasks,
        [taskId]: {
          ...board.tasks[taskId],
          content: newContent,
          color: newColor,
        },
      },
    };
    setBoard(newBoard);
  };

  const deleteTask = (taskId) => {
    const newTasks = { ...board.tasks };
    delete newTasks[taskId];
    const newColumns = Object.keys(board.columns).reduce((acc, columnId) => {
      acc[columnId] = {
        ...board.columns[columnId],
        taskIds: board.columns[columnId].taskIds.filter((id) => id !== taskId),
      };
      return acc;
    }, {});
    const newBoard = {
      ...board,
      tasks: newTasks,
      columns: newColumns,
    };
    setBoard(newBoard);
  };

  const filteredTasks = (tasks) => {
    if (!filter) return tasks;
    return tasks.filter((task) =>
      task.content.toLowerCase().includes(filter.toLowerCase()) ||
      task.color.toLowerCase().includes(filter.toLowerCase())
    );
  };

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <TaskForm onSubmit={addTask} />
        <FilterBar setFilter={setFilter} />
      </div>
      <DragDropContext className="flex flex-1 px-4 min-w-[1000px]" onDragEnd={onDragEnd}>
        <div className="flex flex-1 space-x-4">
          {board.columnOrder.map((columnId) => {
            const column = board.columns[columnId];
            const tasks = filteredTasks(column.taskIds.map((taskId) => board.tasks[taskId]));
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}