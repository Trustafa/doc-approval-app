import { findLoggedInUser } from '@/app/api/_services/auth.service';
import { approveRequestByUser } from '@/app/api/_services/request.service';

export async function POST(
  _: unknown,
  { params }: { params: Promise<{ requestId: string }> }
): Promise<Response> {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const { requestId } = await params;
  const success = await approveRequestByUser(requestId, user);

  if (!success) {
    return new Response(null, { status: 400 });
  }

  return Response.json(null, { status: 204 });
}
