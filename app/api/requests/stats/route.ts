import { ApprovalDecision } from '@/generated/prisma/enums';
import { findLoggedInUser } from '../../_services/auth.service';
import { DashboardStats } from '../../_services/request.service';
import { prisma } from '../../prisma';

export async function GET() {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const pendingForMe = await prisma.request.count({
    where: {
      approvals: {
        some: {
          approverId: user.id,
          decision: ApprovalDecision.PENDING,
        },
      },
    },
  });

  const pendingByMe = await prisma.request.count({
    where: {
      requesterId: user.id,
      approvals: {
        some: {
          decision: ApprovalDecision.PENDING,
        },
      },
    },
  });
  const approvedByMe = await prisma.request.count({
    where: {
      requesterId: user.id,
      approvals: {
        some: {
          decision: ApprovalDecision.APPROVED,
        },
      },
    },
  });
  const rejectedByMe = await prisma.request.count({
    where: {
      requesterId: user.id,
      approvals: {
        some: {
          decision: ApprovalDecision.REJECTED,
        },
      },
    },
  });

  const totalRequests = await prisma.request.count({
    where: {
      requesterId: user.id,
    },
  });

  const data: DashboardStats = {
    pendingForMe,
    pendingByMe,
    approvedByMe,
    rejectedByMe,
    totalRequests,
  };

  return Response.json({ data }, { status: 200 });
}
