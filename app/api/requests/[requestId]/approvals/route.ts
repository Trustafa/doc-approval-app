import { toApprovalResponse } from '@/app/api/_services/approval.service';
import { findLoggedInUser } from '@/app/api/_services/auth.service';
import { prisma } from '@/app/api/prisma';
import { ApprovalDecision } from '@/generated/prisma/enums';

export async function GET(
  _: unknown,
  { params }: { params: Promise<{ requestId: string }> }
): Promise<Response> {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const { requestId } = await params;
  const request = await prisma.request.findUnique({
    where: {
      id: requestId,
      OR: [
        { requesterId: user.id },
        { approvals: { some: { approverId: user.id } } },
      ],
    },
    include: { approvals: { include: { approver: true } } },
  });

  if (!request) {
    return new Response(null, { status: 404 });
  }

  return Response.json(
    {
      data: request.approvals.map(toApprovalResponse),
      count: request.approvals.length,
      canApprove: request.approvals.some(
        (a) =>
          a.approverId === user.id && a.decision === ApprovalDecision.PENDING
      ),
    },
    { status: 200 }
  );
}
