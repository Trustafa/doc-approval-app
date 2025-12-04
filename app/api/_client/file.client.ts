import { apiFetch } from './apiFetch';

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
  const res = await apiFetch('/api/files', {
    method: 'POST',
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

export async function getFile(
  fileId: string,
  params: { download: boolean } = { download: true }
): Promise<
  | { success: true; data: Blob; headers: Headers }
  | { success: false; status: number }
> {
  const res = await apiFetch(
    `/api/files/${fileId}${!params.download ? '/preview' : ''}`
  );
  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const blob = await res.blob();

  return {
    success: true,
    data: blob,
    headers: res.headers,
  };
}

export async function downloadFile(fileId: string) {
  const res = await getFile(fileId, { download: true });

  if (!res.success) {
    alert(`Error fetching file: ${res.status}`);
    return;
  }

  const blob = res.data;
  const disposition = res.headers.get('Content-Disposition') || '';
  const filenameMatch = disposition.match(/filename="?(.+?)"?($|;)/);
  const fileName = filenameMatch ? filenameMatch[1] : 'file';

  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(downloadUrl);
}

export async function previewFile(fileId: string) {
  const res = await getFile(fileId, { download: false });

  if (!res.success) {
    alert(`Error fetching file: ${res.status}`);
    return;
  }

  const blob = res.data;

  const url = URL.createObjectURL(blob);

  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.width = '100%';
  iframe.height = '600px';
  document.body.appendChild(iframe);
}
