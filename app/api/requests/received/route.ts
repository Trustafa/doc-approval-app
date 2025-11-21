import { NextRequest } from 'next/server';
import { toRequestResponse } from '../../_services/request.service';
import { findLoggedInUser } from '../../_services/auth.service';
import { prisma } from '../../prisma';
import { ApprovalDecision, Prisma } from '@/generated/prisma/client';

export async function GET(req: NextRequest) {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const statusQuery = searchParams.get('status');
  const pageQuery = searchParams.get('page') ?? 1;
  const pageSizeQuery = searchParams.get('pageSize') ?? 20;

  const statusIsPending = statusQuery === 'PENDING';

  const skip = (Number(pageQuery) - 1) * Number(pageSizeQuery);
  const where = {
    approvals: {
      some: {
        approverId: user.id,
        decision: statusIsPending ? ApprovalDecision.PENDING : undefined,
      },
    },
  } satisfies Prisma.RequestWhereInput;

  const requests = await prisma.request.findMany({
    skip,
    take: Number(pageSizeQuery),
    where,
    include: {
      approvals: true,
      requester: true,
    },
  });
  const count = await prisma.request.count({ where });

  return Response.json(
    { data: requests.map(toRequestResponse), count },
    { status: 200 }
  );
}
