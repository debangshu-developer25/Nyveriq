import React, { useState, useEffect } from "react";
import Sidebar from '../components/Layout/Sidebar';
import { useAllTasks } from '../hooks/useAllTasks';
import { Task, Project } from '../types';
import api from "../api/axiosInstance";
import { toast } from "react-toastify" ;
import {
  FaFolder,
  FaTasks,
  FaFlag,
  FaUser,
  FaCalendarAlt,
  FaAlignLeft,
} from "react-icons/fa";
import AttachmentUpload from "../Attachments/AttachmentUpload";
import AttachmentList from "../Attachments/AttachmentList";
import CommentSection from "../Comments/CommentSection";

import { getRecentAuditLogs } from "../services/auditLogService";

const statusColor: Record<Task['status'], string> = {
  Todo: '#94a3b8',
  InProgress: '#f59e0b',
  Done: '#22c55e',
};

const priorityColor: Record<Task['priority'], string> = {
  Low: '#94a3b8',
  Medium: '#f59e0b',
  High: '#ef4444',
};

const AllTasks: React.FC = () => {
  const { tasks, loading, error } = useAllTasks();
  useEffect(() => {
  const loadUsers = async () => {
    try {
      const response = await api.get("/users");
      console.log("Users:", response.data); 
      const projectResponse = await api.get("/projects");
      console.log("Projects:", projectResponse.data);
      setProjects(projectResponse.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  loadUsers();
}, []);
  const [filter, setFilter] = useState<'All' | Task['status']>('All');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<
  "All" | Task["priority"]>("All");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTask, setNewTask] = useState({
  projectId: 0,
  title: "",
  description: "",
  priority: "Medium",
  assignedTo: null as number | null,
  dueDate: "",
});
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const filteredTasks = tasks.filter((task) => {
  const matchesStatus =
    filter === "All" || task.status === filter;

  const matchesPriority =
    priorityFilter === "All" ||
    task.priority === priorityFilter;

  const matchesSearch =
    task.title.toLowerCase().includes(
      search.toLowerCase()
    );

  return (
    matchesStatus &&
    matchesPriority &&
    matchesSearch
  );
});

  const handleSave = async () => {
  if (!selectedTask) return;

  try {
    await api.put(`/tasks/${selectedTask.taskId}`, {
      title: selectedTask.title,
      description: selectedTask.description,
      assignedTo: selectedTask.assignedTo,
      priority: selectedTask.priority,
      dueDate: selectedTask.dueDate,
    });

    alert("Task updated successfully!");

    setShowModal(false);
    setIsEditing(false);

    window.location.reload();
  } catch (error) {
    console.error(error);
    alert("Failed to update task");
  }
};
  const handleDelete = async (taskId: number) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this task?"
  );

  
  if (!confirmDelete) return;

  try {
    await api.delete(`/tasks/${taskId}`);

    alert("Task deleted successfully!");

    window.location.reload();
  } catch (error) {
    console.error(error);
    alert("Failed to delete task.");
  }
};
  const handleCreateTask = async () => {
  try {
    await api.post("/tasks", {
      projectId: newTask.projectId,
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
    });

    
    toast.success("Task created successfully!");
    
    setShowCreateModal(false);

    window.location.reload();
  } catch (error) {
    console.error(error);
    toast.error("Failed to create task.");
  }
};

  if (loading) return <p style={{ padding: 24 }}>Loading tasks...</p>;
  if (error) return <p style={{ padding: 24, color: 'red' }}>{error}</p>;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 24 }}>
        

        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  }}
>
  <h2>All Tasks</h2>

  <button
  onClick={() => setShowCreateModal(true)}
  style={{
    background: "#6366f1",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  }}
>
  ➕ New Task
</button>
</div>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  }}
>
  <input
    type="text"
    placeholder="Search by task title..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      width: 350,
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: 8,
      fontSize: 14,
      outline: "none",
    }}
  />

  <select
    value={priorityFilter}
    onChange={(e) =>
      setPriorityFilter(
        e.target.value as
          | "All"
          | "Low"
          | "Medium"
          | "High"
      )
    }
    style={{
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: 8,
      fontSize: 14,
      cursor: "pointer",
    }}
  >
    <option value="All">All Priorities</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>
</div>

<div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
  {(['All', 'Todo', 'InProgress', 'Done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 16px', borderRadius: 8, border: '1px solid #e2e8f0',
                background: filter === f ? '#6366f1' : '#fff',
                color: filter === f ? '#fff' : '#475569',
                cursor: 'pointer',
              }}
            >
              {f === 'InProgress' ? 'In Progress' : f}
            </button>
          ))}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: 12 }}>Task</th>
              <th style={{ padding: 12 }}>Status</th>
              <th style={{ padding: 12 }}>Priority</th>
              <th style={{ padding: 12 }}>Assigned To</th>
              <th style={{ padding: 12 }}>Due Date</th>
              <th style={{ padding: 12 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr
  key={task.taskId}
  style={{
    borderBottom: "1px solid #f1f5f9",
    transition: "all .2s ease",
    cursor: "pointer",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#f8fafc";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#fff";
  }}
>
                <td style={{ padding: 12, fontWeight: 500 }}>{task.title}</td>
                <td style={{ padding: 12 }}>
                  <span
  style={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 110,
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
    background: statusColor[task.status],
    letterSpacing: "0.3px",
  }}
>
                   {task.status === "Todo" && "🟦 Todo"}

{task.status === "InProgress" && "🟡 In Progress"}

{task.status === "Done" && "🟢 Done"}
                  </span>
                </td>
                <td style={{ padding: 12 }}>
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 90,
      padding: "6px 12px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 600,
      color: "#fff",
      background: priorityColor[task.priority],
    }}
  >
    {task.priority === "Low" && "🟢 Low"}
    {task.priority === "Medium" && "🟠 Medium"}
    {task.priority === "High" && "🔴 High"}
  </span>
</td>
                <td style={{ padding: 12 }}>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    {/* View */}
    <button
      onClick={() => {
        setSelectedTask(task);
        setShowModal(true);
      }}
      title="View Task"
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "none",
        background: "#eff6ff",
        color: "#2563eb",
        cursor: "pointer",
        transition: "all .2s ease",
        fontSize: 15,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#2563eb";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#eff6ff";
        e.currentTarget.style.color = "#2563eb";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      👁
    </button>

    {/* Edit */}
    <button
      onClick={() => {
        setSelectedTask(task);
        setIsEditing(true);
        setShowModal(true);
      }}
      title="Edit Task"
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "none",
        background: "#fff7ed",
        color: "#ea580c",
        cursor: "pointer",
        transition: "all .2s ease",
        fontSize: 15,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#ea580c";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#fff7ed";
        e.currentTarget.style.color = "#ea580c";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      ✏️
    </button>

    {/* Delete */}
    <button
      onClick={() => handleDelete(task.taskId)}
      title="Delete Task"
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "none",
        background: "#fef2f2",
        color: "#dc2626",
        cursor: "pointer",
        transition: "all .2s ease",
        fontSize: 15,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#dc2626";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#fef2f2";
        e.currentTarget.style.color = "#dc2626";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      🗑
    </button>
  </div>
</td>
                
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTasks.length === 0 && <p style={{ marginTop: 16, color: '#94a3b8' }}>No tasks found.</p>}
        {showModal && selectedTask && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        width: 500,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      <h2>📋 Task Details</h2>

      <hr />

      <div style={{ marginBottom: 16 }}>
  <strong>Title:</strong>

  {isEditing ? (
    <input
      type="text"
      value={selectedTask.title}
      onChange={(e) =>
        setSelectedTask({
          ...selectedTask,
          title: e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "10px",
        marginTop: 8,
        border: "1px solid #d1d5db",
        borderRadius: 8,
      }}
    />
  ) : (
    <p>{selectedTask.title}</p>
  )}
</div>
      <div style={{ marginBottom: 16 }}>
  <strong>Description:</strong>

  {isEditing ? (
    <textarea
      value={selectedTask.description ?? ""}
      onChange={(e) =>
        setSelectedTask({
          ...selectedTask,
          description: e.target.value,
        })
      }
      rows={4}
      style={{
        width: "100%",
        padding: "10px",
        marginTop: 8,
        border: "1px solid #d1d5db",
        borderRadius: 8,
        resize: "vertical",
      }}
    />
  ) : (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
      }}
    >
      {selectedTask.description || "No description"}
    </div>
  )}
</div>
      <p><strong>Status:</strong> {selectedTask.status}</p>

      <div style={{ marginBottom: 16 }}>
  <strong>Priority:</strong>

  {isEditing ? (
    <select
      value={selectedTask.priority}
      onChange={(e) =>
        setSelectedTask({
          ...selectedTask,
          priority: e.target.value as "Low" | "Medium" | "High",
        })
      }
      style={{
        width: "100%",
        padding: "10px",
        marginTop: 8,
        borderRadius: 8,
        border: "1px solid #d1d5db",
      }}
    >
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
  ) : (
    <p>{selectedTask.priority}</p>
  )}
</div>

      <div style={{ marginBottom: 16 }}>
  <strong>Assigned To:</strong>

  {isEditing ? (
    <select
      value={selectedTask.assignedTo ?? ""}
      onChange={(e) =>
        setSelectedTask({
          ...selectedTask,
          assignedTo: e.target.value
            ? Number(e.target.value)
            : null,

          assignedUserName: e.target.value
            ? users.find(
                (u) =>
                  u.userId === Number(e.target.value)
              )?.fullName
            : "Unassigned",
        })
      }
      style={{
        width: "100%",
        padding: "10px",
        marginTop: 8,
        border: "1px solid #d1d5db",
        borderRadius: 8,
      }}
    >
      <option value="">Unassigned</option>

      {users.map((user) => (
        <option
          key={user.userId}
          value={user.userId}
        >
          {user.fullName}
        </option>
      ))}
    </select>
  ) : (
    <p>
      {selectedTask.assignedUserName ??
        "Unassigned"}
    </p>
  )}
</div>

      <div style={{ marginBottom: 16 }}>
  <strong>Due Date:</strong>

  {isEditing ? (
    <input
      type="date"
      value={
        selectedTask.dueDate
          ? selectedTask.dueDate.substring(0, 10)
          : ""
      }
      onChange={(e) =>
        setSelectedTask({
          ...selectedTask,
          dueDate: e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "10px",
        marginTop: 8,
        borderRadius: 8,
        border: "1px solid #d1d5db",
      }}
    />
  ) : (
    <p>
      {selectedTask.dueDate
        ? new Date(selectedTask.dueDate).toLocaleDateString()
        : "-"}
    </p>
  )}
</div>
<hr style={{ margin: "20px 0" }} />

<h3>📎 Attachments</h3>

<AttachmentUpload
  taskId={selectedTask.taskId}
  onUploaded={() => window.location.reload()}
/>

<AttachmentList
  taskId={selectedTask.taskId}
/>
<hr style={{ margin: "20px 0" }} />

<CommentSection
    taskId={selectedTask.taskId}
/>
      <div
        style={{
          marginTop: 30,
          textAlign: "right",
        }}
      >
        <div
  style={{
    marginTop: 30,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  }}
>
  {isEditing && (
    <button
      onClick={handleSave}
      style={{
        padding: "10px 20px",
        background: "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
      }}
    >
      💾 Save
    </button>
  )}

  <button
    onClick={() => {
      setShowModal(false);
      setIsEditing(false);
    }}
    style={{
      padding: "10px 20px",
      background: "#6366f1",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
    }}
  >
    Close
  </button>
</div>
      </div>
    </div>
  </div>
)}
{showCreateModal && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
  style={{
    width: 650,
    background: "#fff",
    borderRadius: 20,
    padding: 32,
    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
  }}
>
      <div
  style={{
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: "1px solid #e5e7eb",
  }}
>
  <h2
    style={{
      margin: 0,
      fontSize: 28,
      fontWeight: 700,
      color: "#111827",
    }}
  >
    📝 Create New Task
  </h2>

  <p
    style={{
      marginTop: 8,
      color: "#6b7280",
      fontSize: 14,
    }}
  >
    Create and assign a new task to your project.
  </p>
</div>
    <div style={{ marginBottom: 16 }}>
  <label
  style={{
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
    color: "#374151",
  }}
>
  <span style={{ fontSize: 18 }}>📁</span>

  <span>
    Project <span style={{ color: "red" }}>*</span>
  </span>
</label>

  <select
    value={newTask.projectId}
    onChange={(e) =>
      setNewTask({
        ...newTask,
        projectId: Number(e.target.value),
      })
    }
    style={{
      width: "100%",
      padding: "10px",
      marginTop: 6,
      borderRadius: 8,
      border: "1px solid #d1d5db",
    }}
  >
    <option value={0}>Select Project</option>

    {projects.map((project) => (
      <option
        key={project.projectId}
        value={project.projectId}
      >
        {project.name}
      </option>
    ))}
  </select>
</div>

      <div style={{ marginTop: 30 }}>
  <label style={{ fontWeight: 600 }}>📝 Title *</label>

  <input
  type="text"
  placeholder="Enter task title"
  value={newTask.title}
  onChange={(e) =>
    setNewTask({
      ...newTask,
      title: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: 6,
    marginBottom: 16,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
  }}
/>
</div>
<div style={{ marginBottom: 16 }}>
  <label style={{ fontWeight: 600 }}>⚡ Priority *</label>

  <select
    value={newTask.priority}
    onChange={(e) =>
      setNewTask({
        ...newTask,
        priority: e.target.value,
      })
    }
    style={{
      width: "100%",
      padding: "10px",
      marginTop: 6,
      borderRadius: 8,
      border: "1px solid #d1d5db",
    }}
  >
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>
</div>
<div style={{ marginBottom: 16 }}>
  <label style={{ fontWeight: 600 }}>👤 Assigned To</label>

  <select
    value={newTask.assignedTo ?? ""}
    onChange={(e) =>
      setNewTask({
        ...newTask,
        assignedTo: e.target.value
          ? Number(e.target.value)
          : null,
      })
    }
    style={{
      width: "100%",
      padding: "10px",
      marginTop: 6,
      borderRadius: 8,
      border: "1px solid #d1d5db",
    }}
  >
    <option value="">Unassigned</option>

    {users.map((user) => (
      <option
        key={user.userId}
        value={user.userId}
      >
        {user.fullName}
      </option>
    ))}
  </select>
</div>
<div style={{ marginBottom: 16 }}>
  <label style={{ fontWeight: 600 }}>📅 Due Date</label>

  <input
    type="date"
    value={newTask.dueDate}
    onChange={(e) =>
      setNewTask({
        ...newTask,
        dueDate: e.target.value,
      })
    }
    style={{
      width: "100%",
      padding: "10px",
      marginTop: 6,
      borderRadius: 8,
      border: "1px solid #d1d5db",
      boxSizing: "border-box",
    }}
  />
</div>
<div style={{ marginBottom: 16 }}>
  <label style={{ fontWeight: 600 }}>📄 Description</label>

  <textarea
    rows={4}
    placeholder="Enter task description"
    value={newTask.description}
    onChange={(e) =>
      setNewTask({
        ...newTask,
        description: e.target.value,
      })
    }
    style={{
      width: "100%",
      padding: "10px",
      marginTop: 6,
      borderRadius: 8,
      border: "1px solid #d1d5db",
      resize: "vertical",
      boxSizing: "border-box",
    }}
  />
</div>

      <div
  style={{
    marginTop: 30,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  }}
>
  <button
  onClick={handleCreateTask}
  disabled={
  !newTask.projectId ||
  !newTask.title.trim()
}
  style={{
    background:
  !newTask.projectId || !newTask.title.trim()
    ? "#9ca3af"
    : "linear-gradient(135deg, #2563eb, #4f46e5)",
padding: "12px 24px",
borderRadius: 10,
fontWeight: 600,
boxShadow: "0 6px 16px rgba(37,99,235,.25)",
opacity:
  !newTask.projectId || !newTask.title.trim()
    ? 0.7
    : 1,
  }}
>
   ✓ Create Task
</button>

  <button
    onClick={() => setShowCreateModal(false)}
    style={{
  padding: "12px 22px",
  background: "#f3f4f6",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: 10,
  cursor:
  !newTask.projectId || !newTask.title.trim()
    ? "not-allowed"
    : "pointer",
  fontWeight: 600,
}}
    
  >
    Cancel
  </button>
</div>

    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default AllTasks;