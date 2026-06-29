import api from "../api/axiosInstance";
import React, { useState } from "react";
import Sidebar from "../components/Layout/Sidebar";
import Modal from "../components/Common/Modal";
import CreateProjectForm from "../components/Projects/CreateProjectForm";
import EditProjectForm from "../components/Projects/EditProjectForm";
import { useDashboardData } from "../hooks/useDashboardData";
import { useAuth } from "../context/AuthContext";


const Projects: React.FC = () => {
  const { projects, loading, error, refetch } = useDashboardData();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const handleDelete = async (projectId: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this project?"
  );

  if (!confirmed) return;

  try {
    await api.delete(`/projects/${projectId}`);

    alert("Project deleted successfully.");

    refetch();
  } catch (err: any) {
    console.error(err);

    if (err.response?.status === 403) {
      alert("Only Admin can delete projects.");
    } else if (err.response?.status === 404) {
      alert("Project not found.");
    } else {
      alert("Failed to delete project.");
    }
  }
};

  if (loading)
    return <p style={{ padding: 24 }}>Loading projects...</p>;

  if (error)
    return (
      <p style={{ padding: 24, color: "red" }}>
        {error}
      </p>
    );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 24 }}>
        {/* Header */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0 }}>📁 Projects</h2>

          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: "10px 18px",
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + New Project
          </button>
        </div>

        {/* Project Cards */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
          }}
        >
          {projects.map((p) => {
            const pct =
              p.totalTasks === 0
                ? 0
                : Math.round(
                    (p.completedTasks / p.totalTasks) * 100
                  );

            return (
              <div
                key={p.projectId}
                style={{
                  padding: 20,
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,.05)",
                }}
              >
                <h3 style={{ margin: "0 0 10px" }}>
                  📁 {p.name}
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: 13,
                    marginBottom: 18,
                  }}
                >
                  {p.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "#94a3b8",
                    }}
                  >
                    {p.completedTasks}/{p.totalTasks} Tasks
                  </span>

                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6366f1",
                    }}
                  >
                    {pct}%
                  </span>
                </div>

                {/* Progress */}

                <div
                  style={{
                    height: 8,
                    background: "#e2e8f0",
                    borderRadius: 20,
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: 8,
                      background: "#6366f1",
                      borderRadius: 20,
                    }}
                  />
                </div>

                {/* Footer */}

                <div
                  style={{
                    marginTop: 16,
                    fontSize: 12,
                    color: "#94a3b8",
                  }}
                >
                  👤 Created by {p.createdByName}
                </div>

                <div
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    color: "#94a3b8",
                  }}
                >
                  📅 {new Date(p.createdAt).toLocaleDateString()}
                </div>

                {/* Role Based Buttons */}

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 18,
                  }}
                >
                  {(user?.role === "Admin" ||
                  user?.role === "Manager") && (
                  <button
                    onClick={() => {
                    setSelectedProject(p);
                    setIsEditModalOpen(true);
                  }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderRadius: 8,
                    background: "#EEF2FF",
                    color: "#4F46E5",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  ✏ Edit
                </button>
              )}

                  <button
                  onClick={() => handleDelete(p.projectId)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderRadius: 8,
                    background: "#FEE2E2",
                    color: "#DC2626",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {projects.length === 0 && (
          <p
            style={{
              color: "#94a3b8",
              marginTop: 24,
            }}
          >
            No projects yet.
          </p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <CreateProjectForm
          onCreated={refetch}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
      <Modal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      title="Edit Project"
      >
        {selectedProject && (
          <EditProjectForm
          project={selectedProject}
          onUpdated={refetch}
          onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Projects;