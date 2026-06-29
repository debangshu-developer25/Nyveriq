import React, { useState } from 'react';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';

interface Props {
  onCreated: () => void;
  onClose: () => void;
}

const CreateProjectForm: React.FC<Props> = ({ onCreated, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/projects', {
        name,
        description: description || null,
      });

      toast.success('Project created successfully');
      onCreated();
      onClose();
    } catch (err) {
      toast.error('Failed to create project');
      setError('Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red', fontSize: 13 }}>{error}</p>}

      <label style={{ fontSize: 13, fontWeight: 500 }}>Project Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: 8,
          marginBottom: 12,
          marginTop: 4,
        }}
      />

      <label style={{ fontSize: 13, fontWeight: 500 }}>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        style={{
          display: 'block',
          width: '100%',
          padding: 8,
          marginBottom: 16,
          marginTop: 4,
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          width: '100%',
          padding: 10,
          background: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting ? 'Creating...' : 'Create Project'}
      </button>
    </div>
  );
};

export default CreateProjectForm;