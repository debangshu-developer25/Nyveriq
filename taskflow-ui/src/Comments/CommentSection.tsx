import React, { useEffect, useState } from "react";
import { getComments, addComment, deleteComment } from "../services/commentService";

type Props = {
  taskId: number;
};

const CommentSection = ({ taskId }: Props) => {
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState("");

  const loadComments = async () => {
    const data = await getComments(taskId);
    setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, [taskId]);

  const handleAdd = async () => {
    if (!content.trim()) return;

    await addComment(taskId, content);

    setContent("");

    loadComments();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this comment?")) return;

    await deleteComment(id);

    loadComments();
  };

  return (
    <div>

      <h3>💬 Comments</h3>

      {comments.map((c) => (
        <div
          key={c.commentId}
          style={{
            borderBottom: "1px solid #eee",
            padding: "10px 0"
          }}
        >
          <strong>{c.userName}</strong>

          <p>{c.content}</p>

          <small>
            {new Date(c.createdAt).toLocaleString()}
          </small>

          <br />

          <button
            onClick={() => handleDelete(c.commentId)}
          >
            🗑 Delete
          </button>
        </div>
      ))}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        style={{
          width: "100%",
          marginTop: 15,
          padding: 10
        }}
      />

      <button
        onClick={handleAdd}
        style={{
          marginTop: 10
        }}
      >
        Add Comment
      </button>

    </div>
  );
};

export default CommentSection;