import React, { useState } from "react";
import { uploadAttachment } from "../services/attachmentService";

type Props = {
  taskId: number;
  onUploaded: () => void;
};

const AttachmentUpload = ({ taskId, onUploaded }: Props) => {

  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {

    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {

      await uploadAttachment(taskId, file);

      alert("✅ File uploaded successfully.");

      setFile(null);

      onUploaded();

    } catch (err) {

      console.error(err);

      alert("Upload failed.");

    }

  };

  return (

    <div style={{ marginBottom: 20 }}>

      <input
        type="file"
        onChange={(e) => {

          if (e.target.files)
            setFile(e.target.files[0]);

        }}
      />

      <button
        onClick={handleUpload}
        style={{
          marginLeft: 10,
          padding: "8px 18px",
          cursor: "pointer"
        }}
      >
        Upload
      </button>

    </div>

  );

};

export default AttachmentUpload;