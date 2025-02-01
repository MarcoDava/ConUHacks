import { Droppable } from "@hello-pangea/dnd"
import Task from "./Task"

export default function Column({ column, tasks, updateTask, deleteTask }) {
  return (
    (<div className="bg-gray-100 p-4 rounded-lg shadow-md w-72">
      <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px]">
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                updateTask={updateTask}
                deleteTask={deleteTask} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>)
  );
}

