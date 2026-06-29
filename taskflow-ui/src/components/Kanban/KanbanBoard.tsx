import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import KanbanColumn from "./KanbanColumn";
import "../../styles/kanban.css";
import { Task, ApiTask } from "./types";

import {
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";



const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
    
  }, []);

  const loadTasks = async () => {
    try {
      const response = await api.get<ApiTask[]>("/tasks");

      const tasks = response.data.map((t): Task => ({
        id: t.taskId,
        title: t.title,
        priority: t.priority as "Low" | "Medium" | "High",
        assignee: t.assignedUserName ?? "Unassigned",
        status: t.status,
      }));

      setTasks(tasks);
      console.log("Total tasks:", tasks.length);
      console.table(
  tasks.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
  }))
);
    } catch (error) {
      console.error("Failed to load tasks", error);
    } finally {
      setLoading(false);
    }
  };
  const todo = tasks.filter((t) => t.status === "Todo");
  const progress = tasks.filter((t) => t.status === "InProgress");
  const done = tasks.filter((t) => t.status === "Done");
  // 👇 Add this here
  const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;

  if (!over) return;

  const taskId = Number(active.id);
  let newStatus = String(over.id);

if (
  newStatus !== "Todo" &&
  newStatus !== "InProgress" &&
  newStatus !== "Done"
) {
  const targetTask = tasks.find(
    (t) => t.id === Number(over.id)
  );

  if (!targetTask) return;

  newStatus = targetTask.status;
}
  console.log("Active:", active.id);
  console.log("Over:", over.id);


  // If dropped in the same column, do nothing
  const currentTask = tasks.find((t) => t.id === taskId);

  if (!currentTask) return;

  if (currentTask.status === newStatus) return;

  // Update UI immediately
  setTasks((prev) =>
    prev.map((task) =>
      task.id === taskId
        ? { ...task, status: newStatus }
        : task
    )
  );

  try {
    // Save to database
    await api.put(`/tasks/${taskId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error(error);

    // Reload from DB if API fails
    loadTasks();
  }
};
console.log("Todo:", todo.length);
console.log("Progress:", progress.length);
console.log("Done:", done.length);

  if (loading) {
    return <h3>Loading Kanban Board...</h3>;
  }

  return (
  <DndContext
    onDragEnd={handleDragEnd}
  >
    <div className="kanban-board">

      <KanbanColumn
        id="Todo"
        title="📝 To Do"
        tasks={todo}
      />

      <KanbanColumn
        id="InProgress"
        title="🚀 In Progress"
        tasks={progress}
      />

      <KanbanColumn
        id="Done"
        title="✅ Done"
        tasks={done}
      />

    </div>
  </DndContext>
  );
};


export default KanbanBoard;