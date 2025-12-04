import { Prisma } from '@/generated/prisma/client';
import { NextRequest } from 'next/server';
import { findLoggedInUser } from '../../_services/auth.service';
import { toRequestResponse } from '../../_services/request.service';
import { prisma } from '../../prisma';

export async function GET(req: NextRequest) {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;

  const payee = searchParams.get('payee') ?? undefined;
  const internalRef = searchParams.get('internalRef') ?? undefined;

  const idNumber = searchParams.get('idNumber');
  const amountFrom = searchParams.get('amountFrom');
  const amountTo = searchParams.get('amountTo');

  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');

  const statusQuery = searchParams.get('status');
  const statusIsPending = statusQuery === 'PENDING';

  const pageQuery = searchParams.get('page') ?? 1;
  const pageSizeQuery = searchParams.get('pageSize') ?? 20;

  const skip = (Number(pageQuery) - 1) * Number(pageSizeQuery);

  const where = {
    requesterId: user.id,
    approvals: statusIsPending ? { some: { decision: 'PENDING' } } : undefined,

    ...(payee && { payee: { contains: payee, mode: 'insensitive' } }),
    ...(internalRef && { internalRef: internalRef }),

    ...(idNumber && { idNumber: Number(idNumber) }),

    ...(amountFrom || amountTo
      ? {
          amount: {
            ...(amountFrom && { gte: Number(amountFrom) }),
            ...(amountTo && { lte: Number(amountTo) }),
          },
        }
      : {}),

    ...(fromDate || toDate
      ? {
          createdAt: {
            ...(fromDate && { gte: new Date(fromDate) }),
            ...(toDate && { lte: new Date(toDate) }),
          },
        }
      : {}),
  } satisfies Prisma.RequestWhereInput;

  const requests = await prisma.request.findMany({
    skip,
    take: Number(pageSizeQuery),
    where,
    orderBy: {
      createdAt: 'desc',
    },
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
