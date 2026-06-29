import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./types";
import "../../styles/kanban.css";

interface Props {
  task: Task;
}

const TaskCard: React.FC<Props> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <div className={`priority ${task.priority.toLowerCase()}`}>
        {task.priority}
      </div>

      <h4>{task.title}</h4>

      <div className="task-footer">
        👤 {task.assignee}
      </div>
    </div>
  );
};

export default TaskCard;