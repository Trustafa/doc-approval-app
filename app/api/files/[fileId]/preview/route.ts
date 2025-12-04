import { readFile } from 'fs/promises';
import { join } from 'path';
import { findLoggedInUser } from '../../../_services/auth.service';
import { prisma } from '../../../prisma';

export async function GET(
  _: unknown,
  { params }: { params: Promise<{ fileId: string }> }
): Promise<Response> {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const { fileId } = await params;

  const file = await prisma.file.findUnique({ where: { id: fileId } });
  if (!file) {
    return new Response(null, { status: 404 });
  }

  const headers = new Headers();
  headers.set('Content-Disposition', `inline; filename="${file.filename}"`);
  if (file.mimeType) {
    headers.set('Content-Type', file.mimeType);
  }

  try {
    const path = join(process.cwd(), 'uploads', file.key);
    const fileBuffer = await readFile(path);
    return new Response(fileBuffer, { headers });
  } catch (error) {
    console.error('Error reading file:', error);
    return new Response(null, { status: 500 });
  }
}
