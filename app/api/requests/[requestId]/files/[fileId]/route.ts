import { findLoggedInUser } from '@/app/api/_services/auth.service';
import { findFileById } from '@/app/api/_services/file.service';
import {
  findRequestById,
  isRequestApprover,
  isRequestSender,
} from '@/app/api/_services/request.service';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ requestId: string; fileId: string }> }
): Promise<Response> {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const { requestId, fileId } = await params;

  const request = await findRequestById(requestId);

  if (!request) {
    return new Response(null, { status: 404 });
  }

  const isRequester = isRequestSender(user, request);
  const isApprover = isRequestApprover(user, request);

  if (!isRequester && !isApprover) {
    return new Response(null, { status: 403 });
  }

  const file = await findFileById(fileId);

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
