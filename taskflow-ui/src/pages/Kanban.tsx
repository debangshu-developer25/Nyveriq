import React from "react";
import Sidebar from "../components/Layout/Sidebar";
import KanbanBoard from "../components/Kanban/KanbanBoard";

const Kanban: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: 30,
        }}
      >
        <h1>Kanban Board</h1>

        <KanbanBoard />
      </div>
    </div>
  );
};

export default Kanban;