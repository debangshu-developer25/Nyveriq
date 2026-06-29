import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Project } from '../types';

export const useDashboardData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const res = await api.get<Project[]>('/projects');
      setProjects(res.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalTasks = projects.reduce((sum, p) => sum + p.totalTasks, 0);
  const completedTasks = projects.reduce((sum, p) => sum + p.completedTasks, 0);

  return { projects, totalTasks, completedTasks, loading, error, refetch: fetchData };
};