export type UploadedFile = {
  id: string;
  key: string;
  filename: string;
  mimeType: string;
  sizeInBytes: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
};

export async function uploadFileClient(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/files', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: formData,
  });

  if (!res.ok) {
    const error: { error?: string } = await res.json().catch(() => ({}));
    return {
      success: false,
      status: res.status,
      error: error.error ?? 'Upload failed',
    };
  }

  const data: UploadedFile = await res.json();

  return { success: true, data };
}
