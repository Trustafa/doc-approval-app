import { findLoggedInUser } from '@/app/api/_services/auth.service';
import { getRequestStatus } from '@/app/api/_services/request.service';
import { prisma } from '@/app/api/prisma';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ requestId: string }> }
): Promise<Response> {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const { requestId } = await params;
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      approvals: { include: { approver: true } },
      requester: true,
      approvalFile: true,
      supportingFiles: true,
    },
  });

  if (!request) {
    return new Response(null, { status: 404 });
  }

  const canEdit =
    getRequestStatus(request) === 'PENDING' && request.requester.id === user.id;

  return Response.json({ canEdit: canEdit }, { status: 200 });
}
