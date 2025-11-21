import { prisma } from '../prisma';
import { signDocument, uploadFile } from './sys-file.service';
import { File as FileEntity } from '@/generated/prisma/client';

export async function createSignedFile(
  document: FileEntity,
  signature: FileEntity
) {
  const signedDocBuffer = await signDocument(document, signature);

  if (!signedDocBuffer) {
    return null;
  }

  const signedFileKey = await uploadFile(
    {
      name: `signed_${document.filename}`,
      data: Buffer.from(signedDocBuffer),
    },
    document.createdById
  );

  const signedFile = await prisma.file.create({
    data: {
      key: signedFileKey,
      filename: `signed_${document.filename}`,
      mimeType: document.mimeType,
      sizeInBytes: signedDocBuffer.byteLength,
      createdBy: { connect: { id: document.createdById } },
    },
  });

  return signedFile;
}

type FileResponse = {
  id: string;
  createdAt: Date;
  filename: string;
  mimeType: string | null;
  sizeInBytes: number;
};

export function toFileResponse(file: FileEntity): FileResponse {
  return {
    id: file.id,
    createdAt: file.createdAt,
    filename: file.filename,
    mimeType: file.mimeType,
    sizeInBytes: file.sizeInBytes,
  };
}
