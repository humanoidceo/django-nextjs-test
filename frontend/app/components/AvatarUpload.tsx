'use client';

import { useState } from 'react';

export default function AvatarUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked) return;

    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  }

  async function handleUpload() {
    if (!file) return alert('Pick an image first!');

    const token = localStorage.getItem('access_token');
    if (!token) return alert('Not logged in!');

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setStatus('Uploading...');

      const response = await fetch(`${process.env.BACKEND_API}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401) throw new Error('Token expired — log in again');
      if (!response.ok) throw new Error('Upload failed');

      const data: { avatar: string } = await response.json();
      setAvatarUrl(data.avatar);
      setStatus('✅ Avatar saved!');

    } catch (err) {
      setStatus(`❌ ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  return (
    <div>
      <h2>Update your avatar</h2>

      {(preview || avatarUrl) && (
        <img
          src={preview ?? avatarUrl ?? ''}
          alt="avatar preview"
          style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
        />
      )}

      <br />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <button onClick={handleUpload}>
        Save avatar
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}