import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { Task, Project } from "../types";

export const useAllTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const projectsRes = await api.get<Project[]>("/projects");

        const allTasksArrays = await Promise.all(
          projectsRes.data.map((p) =>
            api.get<Task[]>(`/tasks/project/${p.projectId}`)
          )
        );

        const merged = allTasksArrays.flatMap((res) => res.data);

        setTasks(merged);
      } catch (err) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchAllTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
  };
};