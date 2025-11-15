import { findLoggedInUser } from '../../_services/auth.service';
import { uploadFile } from '../../_services/upload.service';

export async function POST(req: Request): Promise<Response> {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return Response.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const BYTES_PER_MB = 1024 * 1024;
  if (file.size > 10 * BYTES_PER_MB) {
    return Response.json(
      { error: 'File size exceeds 10MB limit' },
      { status: 400 }
    );
  }

  const dbFile = await uploadFile(file, user);

  return Response.json(dbFile, { status: 201 });
}
