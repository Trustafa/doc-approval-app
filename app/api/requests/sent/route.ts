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
  const externalRef = searchParams.get('externalRef') ?? undefined;

  const idNumber = searchParams.get('idNumber');
  const amountFrom = searchParams.get('amountFrom');
  const amountTo = searchParams.get('amountTo');

  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');

  const statusQuery = searchParams.get('status');
  const statusIsValid =
    statusQuery === 'PENDING' ||
    statusQuery === 'APPROVED' ||
    statusQuery === 'REJECTED';

  const pageQuery = searchParams.get('page') ?? 1;
  const pageSizeQuery = searchParams.get('pageSize') ?? 20;

  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');

  const skip = (Number(pageQuery) - 1) * Number(pageSizeQuery);

  function endOfDay(dateStr: string) {
    const date = new Date(dateStr);
    date.setHours(23, 59, 59, 999);
    return date;
  }

  const where = {
    requesterId: user.id,
    approvals: statusIsValid ? { some: { decision: statusQuery } } : undefined,

    ...(payee && { payee: { contains: payee, mode: 'insensitive' } }),
    ...(internalRef && { internalRef: internalRef }),
    ...(externalRef && { externalRef: externalRef }),

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
            ...(toDate && { lte: endOfDay(toDate) }),
          },
        }
      : {}),
  } satisfies Prisma.RequestWhereInput;

  const requests = await prisma.request.findMany({
    skip,
    take: Number(pageSizeQuery),
    where,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder as 'asc' | 'desc',
          }
        : {
            createdAt: 'desc',
          },
    include: {
      approvals: true,
      requester: true,
      approvalFile: true,
    },
  });

  const count = await prisma.request.count({ where });

  return Response.json(
    { data: requests.map(toRequestResponse), count },
    { status: 200 }
  );
}
