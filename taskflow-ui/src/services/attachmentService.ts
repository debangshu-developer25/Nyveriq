import api from "./api";

export const uploadAttachment = async (taskId: number, file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/Attachments/upload/${taskId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getAttachments = async (taskId: number) => {
  const response = await api.get(`/Attachments/task/${taskId}`);

  return response.data;
};

export const deleteAttachment = async (attachmentId: number) => {
  await api.delete(`/Attachments/${attachmentId}`);
};

export const downloadAttachment = (attachmentId: number) => {
  window.open(
    `https://localhost:7018/api/Attachments/download/${attachmentId}`,
    "_blank"
  );
};