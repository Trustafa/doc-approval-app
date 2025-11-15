import { readFile } from 'node:fs/promises';
import { findLoggedInUser } from '../../_services/auth.service';
import { findFileByKey } from '../../_services/file.service';
import { join } from 'node:path';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ key: string }> }
): Promise<Response> {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const { key } = await params;

  const file = await findFileByKey(key);
  if (!file) {
    return new Response(null, { status: 404 });
  }

  const headers = new Headers();
  headers.set('Content-Disposition', `attachment; filename="${file.filename}"`);
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
