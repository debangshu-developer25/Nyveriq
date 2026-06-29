import api from "./api";

export const getComments = async (taskId: number) => {
  const response = await api.get(`/Comments/task/${taskId}`);
  return response.data;
};

export const addComment = async (
  taskId: number,
  content: string
) => {
  const response = await api.post("/Comments", {
    taskId,
    content,
  });

  return response.data;
};

export const deleteComment = async (commentId: number) => {
  await api.delete(`/Comments/${commentId}`);
};