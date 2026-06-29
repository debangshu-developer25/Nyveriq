import React, { useState } from 'react';
import api from '../../api/axiosInstance';
import { Task } from '../../types';
import { toast } from 'react-toastify';

interface Props {
  task: Task;
  onUpdated: () => void;
  onClose: () => void;
}

const EditTaskForm: React.FC<Props> = ({ task, onUpdated, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<Task['priority']>(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.split('T')[0] : ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.put(`/tasks/${task.taskId}`, {
        title,
        description: description || null,
        assignedTo: null,
        priority,
        dueDate: dueDate || null,
      });

      toast.success('Task updated successfully');
      onUpdated();
      onClose();
    } catch (err) {
      toast.error('Failed to update task');
      setError('Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red', fontSize: 13 }}>{error}</p>}

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
        onChange={(e) => setPriority(e.target.value as Task['priority'])}
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
        {submitting ? 'Updating...' : 'Update Task'}
      </button>
    </div>
  );
};

export default EditTaskForm;