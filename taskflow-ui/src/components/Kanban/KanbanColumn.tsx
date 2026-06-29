import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

import TaskCard from "./TaskCard";
import { Task } from "./types";

import "../../styles/kanban.css";

interface Props {
  id: string;
  title: string;
  tasks: Task[];
}

const KanbanColumn: React.FC<Props> = ({
  id,
  title,
  tasks,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
      style={{
        background: isOver ? "#eef2ff" : "#f8fafc",
        transition: "0.2s",
      }}
    >
      <h2>{title}</h2>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;