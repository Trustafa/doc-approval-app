import { User } from '@/generated/prisma/client';
import { createFile } from './file.service';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function uploadFile(file: File, user: User) {
  const key = `${user.id}-${Date.now()}-${file.name.replaceAll(' ', '_')}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const path = join(process.cwd(), 'uploads', key);
  await writeFile(path, fileBuffer);

  return createFile({ file, user, key });
}
