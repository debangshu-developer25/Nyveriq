import React, { useEffect, useState } from "react";
import {
  getAttachments,
  deleteAttachment,
  downloadAttachment,
} from "../services/attachmentService";

type Props = {
  taskId: number;
};

const AttachmentList = ({ taskId }: Props) => {
  const [attachments, setAttachments] = useState<any[]>([]);

  const loadAttachments = async () => {
    const data = await getAttachments(taskId);
    setAttachments(data);
  };

  useEffect(() => {
    loadAttachments();
  }, [taskId]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this attachment?")) return;

    await deleteAttachment(id);
    loadAttachments();
  };

  return (
    <div>
      <h3>📎 Attachments</h3>

      {attachments.length === 0 ? (
        <p>No attachments found.</p>
      ) : (
        attachments.map((a) => (
          <div
            key={a.attachmentId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div>
              <strong>{a.fileName}</strong>
              <br />
              <small>{(a.fileSize / 1024).toFixed(2)} KB</small>
            </div>

            <div>
              <button
                onClick={() => downloadAttachment(a.attachmentId)}
              >
                ⬇ Download
              </button>

              <button
                onClick={() => handleDelete(a.attachmentId)}
                style={{ marginLeft: 10 }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AttachmentList;