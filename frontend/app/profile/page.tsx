"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { updateAvatar } from "../services/authService";

export default function ProfilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];

    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  async function handleUpload() {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await updateAvatar({avatar:file});
      alert(`Avatar saved at: ${res.avatar}`);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  }

  return (
    <div>
      {preview && (
        <img
          src={preview}
          alt="preview"
          width={100}
          height={100}
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <button onClick={handleUpload}>
        Upload Avatar
      </button>
    </div>
  );
}