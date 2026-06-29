import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Task } from '../types';

export const useProjectTasks = (projectId: number) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get<Task[]>(`/tasks/project/${projectId}`);
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const updateTaskStatus = async (taskId: number, status: Task['status']) => {
    // Update UI immediately (optimistic update)
    setTasks((prev) => prev.map((t) => (t.taskId === taskId ? { ...t, status } : t)));
  const deleteTask = async (taskId: number) => {
  setTasks((prev) => prev.filter((t) => t.taskId !== taskId));
  try {
    await api.delete(`/tasks/${taskId}`);
  } catch (err) {
    fetchTasks(); // rollback if it fails
  }
};

    try {
      await api.put(`/tasks/${taskId}/status`, { status });
    } catch (err) {
      // If the API call fails, reload real data to undo the bad update
      fetchTasks();
    }
  };
const deleteTask = async (taskId: number) => {
  setTasks((prev) => prev.filter((t) => t.taskId !== taskId));
  try {
    await api.delete(`/tasks/${taskId}`);
  } catch (err) {
    fetchTasks();
  }
  };

  return { tasks, loading, error, updateTaskStatus, deleteTask, fetchTasks };
};