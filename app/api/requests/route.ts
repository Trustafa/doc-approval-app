import { ApprovalDecision } from '@/generated/prisma/enums';
import { NextRequest } from 'next/server';
import z from 'zod';
import { findLoggedInUser } from '../_services/auth.service';
import { createRequest } from '../_services/request.service';

const createRequestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  payee: z.string(),
  amount: z.number(),
  currency: z.string(),
  internalRef: z.string().optional(),
  externalRef: z.string().optional(),
  approverIds: z.array(z.number()),
  approvalFileId: z.number(),
  supportingFileIds: z.array(z.number()).optional(),
  approvalFileDate: z.coerce.date(),
});

export async function POST(req: NextRequest) {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const body = await req.json();
  const parsedBody = createRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  const data = parsedBody.data;
  const request = await createRequest({
    title: data.title,
    description: data.description,
    payee: data.payee,
    amount: data.amount,
    currency: data.currency,
    internalRef: data.internalRef,
    externalRef: data.externalRef,
    approvalFileId: data.approvalFileId,
    supportingFileIds: data.supportingFileIds || [],
    approvalFileDate: data.approvalFileDate,
    approverIds: data.approverIds,
    requesterId: user.id,
  });

  return Response.json(request, { status: 201 });
}
