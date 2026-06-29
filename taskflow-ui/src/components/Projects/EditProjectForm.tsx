import React, { useState } from "react";
import api from "../../api/axiosInstance";

interface EditProjectFormProps {
  project: {
    projectId: number;
    name: string;
    description?: string;
    isArchived: boolean;
  };
  onUpdated: () => void;
  onClose: () => void;
}

const EditProjectForm: React.FC<EditProjectFormProps> = ({
  project,
  onUpdated,
  onClose,
}) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(
    project.description || ""
  );
  const [isArchived, setIsArchived] = useState(project.isArchived);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.put(`/projects/${project.projectId}`, {
        name,
        description,
        isArchived,
      });

      onUpdated();
      onClose();
    } catch (err) {
      alert("Failed to update project.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <div style={{ marginBottom: 16 }}>
        <label>Project Name</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 10,
            marginTop: 6,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 6,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>
          <input
            type="checkbox"
            checked={isArchived}
            onChange={(e) => setIsArchived(e.target.checked)}
          />

          {" "}Archive Project
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          background: "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {loading ? "Updating..." : "Update Project"}
      </button>

    </form>
  );
};

export default EditProjectForm;