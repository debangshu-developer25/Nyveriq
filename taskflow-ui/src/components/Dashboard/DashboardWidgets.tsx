import React from "react";
import "../../styles/dashboard.css";

const DashboardWidgets: React.FC = () => {
  return (
    <div className="dashboard-widgets">

      {/* Today's Tasks */}

      <div className="widget-card">

        <h3>📅 Today's Tasks</h3>

        <ul className="widget-list">
          <li>✔ Finish Dashboard UI</li>
          <li>✔ API Integration</li>
          <li>✔ Review Pull Requests</li>
          <li>✔ Update Documentation</li>
        </ul>

      </div>

      {/* Recent Activity */}

      <div className="widget-card">

        <h3>🔥 Recent Activity</h3>

        <ul className="widget-list">
          <li>John created HR Project</li>
          <li>Task "Login API" completed</li>
          <li>Marriage project updated</li>
          <li>New user joined TaskFlow</li>
        </ul>

      </div>

      {/* Quick Actions */}

      <div className="widget-card">

        <h3>⚡ Quick Actions</h3>

        <div className="quick-buttons">

          <button>Create Project</button>

          <button>Create Task</button>

          <button>Open Kanban</button>

          <button>View Reports</button>

        </div>

      </div>

    </div>
  );
};

export default DashboardWidgets;