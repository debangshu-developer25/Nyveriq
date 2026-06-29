import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { User } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get<User[]>('/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId: number, role: User['role']) => {
    setUsers((prev) => prev.map((u) => (u.userId === userId ? { ...u, role } : u)));
    try {
      await api.put(`/users/${userId}/role`, { role });
    } catch (err) {
      fetchUsers();
    }
  };

  return { users, loading, error, updateRole };
};