import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Task } from '../../types';
import { toast } from 'react-toastify';

interface User {
  userId: number;
  fullName: string;
}

interface Props {
  projectId: number;
  onCreated: () => void;
  onClose: () => void;
}

const CreateTaskForm: React.FC<Props> = ({
  projectId,
  onCreated,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState<number | ''>('');
  const [users, setUsers] = useState<User[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch {
        toast.error('Failed to load users');
      }
    };

    loadUsers();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/tasks', {
        projectId,
        title,
        description: description || null,
        assignedTo: assignedTo || null,
        priority,
        dueDate: dueDate || null,
      });

      toast.success('Task created successfully');
      onCreated();
      onClose();
    } catch {
      toast.error('Failed to create task');
      setError('Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {error && (
        <p style={{ color: 'red', fontSize: 13 }}>
          {error}
        </p>
      )}

      <label style={{ fontSize: 13, fontWeight: 500 }}>Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
          marginBottom: 12,
          marginTop: 4,
        }}
      />

      <label style={{ fontSize: 13, fontWeight: 500 }}>Priority</label>
      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as Task['priority'])
        }
        style={{
          display: 'block',
          width: '100%',
          padding: 8,
          marginBottom: 12,
          marginTop: 4,
        }}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <label style={{ fontSize: 13, fontWeight: 500 }}>Assign To</label>
      <select
        value={assignedTo}
        onChange={(e) =>
          setAssignedTo(e.target.value ? Number(e.target.value) : '')
        }
        style={{
          display: 'block',
          width: '100%',
          padding: 8,
          marginBottom: 12,
          marginTop: 4,
        }}
      >
        <option value="">Unassigned</option>

        {users.map((user) => (
          <option key={user.userId} value={user.userId}>
            {user.fullName}
          </option>
        ))}
      </select>

      <label style={{ fontSize: 13, fontWeight: 500 }}>Due Date</label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
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
        {submitting ? 'Creating...' : 'Create Task'}
      </button>
    </div>
  );
};

export default CreateTaskForm;