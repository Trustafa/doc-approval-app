import { findLoggedInUser } from '@/app/api/_services/auth.service';
import { prisma } from '@/app/api/prisma';
import { ApprovalDecision } from '@/generated/prisma/enums';

export async function POST(
  _: unknown,
  { params }: { params: Promise<{ requestId: string }> }
): Promise<Response> {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const { requestId } = await params;

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { approvals: true },
  });
  if (!request) {
    return new Response(null, { status: 404 });
  }

  const approval = request.approvals.find((a) => a.approverId === user.id);
  if (!approval) {
    return new Response(null, { status: 403 });
  }

  if (approval.decision !== ApprovalDecision.PENDING) {
    return new Response(null, { status: 400 });
  }

  const updatedApproval = await prisma.approval.update({
    where: { id: approval.id },
    data: {
      decision: ApprovalDecision.REJECTED,
      decisionAt: new Date(),
    },
  });

  return Response.json(updatedApproval, { status: 200 });
}
