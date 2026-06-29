import React from 'react';
import Sidebar from '../components/Layout/Sidebar';
import { useDashboardData } from '../hooks/useDashboardData';
import '../styles/dashboard.css';
import DashboardCharts from "../components/Dashboard/DashboardCharts";
import DashboardWidgets from "../components/Dashboard/DashboardWidgets";
import NotificationBell from "../components/Notifications/NotificationBell";
import { useEffect } from "react";
import { getRecentAuditLogs } from "../services/auditLogService";

const Dashboard: React.FC = () => {
  const { projects, totalTasks, completedTasks, loading, error } =
    useDashboardData();

    useEffect(() => {

  getRecentAuditLogs()
    .then((data) => {
      console.log("✅ Audit Logs:", data);
    })
    .catch((err) => {
      console.error(err);
    });

}, []);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">
              Good Morning, Debangshu 👋
            </h1>
            <p className="dashboard-subtitle">
  Ready to make progress today? 🚀

  <br />

  <span
    style={{
      fontSize: 14,
      color: "#94a3b8",
    }}
  >
    {new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })}
  </span>
</p>
          </div>
          <div className="header-right">
            <div className="search-box">
              <span className="search-icon">
                🔍
              </span>
              <input
              type="text"
              placeholder="Search projects..."
              />
            </div>
            <NotificationBell />
            <div className="profile-avatar">
              DC
            </div>
          </div>
        </div>

        {/* Statistics */}

        <div className="stats-grid">

          <div className="stat-card project-card-gradient">
            <div className="stat-icon">📁</div>

            <div className="stat-title">
              Total Projects
            </div>

            <div className="stat-value">
              {projects.length}
            </div>

            <div className="stat-footer">
              Active Projects
            </div>
          </div>

          <div className="stat-card task-card-gradient">
            <div className="stat-icon">📋</div>

            <div className="stat-title">
              Total Tasks
            </div>

            <div className="stat-value">
              {totalTasks}
            </div>

            <div className="stat-footer">
              Across all projects
            </div>
          </div>

          <div className="stat-card complete-card-gradient">
            <div className="stat-icon">✅</div>

            <div className="stat-title">
              Completed Tasks
            </div>

            <div className="stat-value">
              {completedTasks}
            </div>

            <div className="stat-footer">
              Finished Successfully
            </div>
          </div>

        </div>

        {/* Charts */}

        <DashboardCharts />
        <DashboardWidgets />

        {/* Projects */}

        <h3 className="projects-title">
          Your Projects
        </h3>

        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map((project) => {

            const progress =
              project.totalTasks === 0
                ? 0
                : Math.round(
                    (project.completedTasks / project.totalTasks) * 100
                  );

            return (
              <div
                key={project.projectId}
                className="project-card"
              >

                <div className="project-header">

                  <div>

                    <div className="project-name">
                      📁 {project.name}
                    </div>

                    <div className="project-description">
                      {project.description}
                    </div>

                  </div>

                  <div className="project-badge">
                    {progress}%
                  </div>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

                <div className="project-footer">

                  <span>
                    ✅ {project.completedTasks} / {project.totalTasks} Tasks
                  </span>

                  <button className="view-btn">
                    View Project →
                  </button>

                </div>

              </div>
            );
          })
        )}

      </div>
    </div>
  );
};

export default Dashboard;