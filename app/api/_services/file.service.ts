import { File as FileEntity, User } from '@/generated/prisma/client';
import { prisma } from '../prisma';

export async function createFile(input: {
  file: File;
  key: string;
  user: User;
}): Promise<FileEntity> {
  const { file } = input;

  return prisma.file.create({
    data: {
      filename: file.name,
      mimeType: file.type,
      sizeInBytes: file.size,
      createdBy: { connect: input.user },
      key: input.key,
    },
  });
}

export async function findFileByKey(key: string): Promise<FileEntity | null> {
  return prisma.file.findUnique({ where: { key } });
}
