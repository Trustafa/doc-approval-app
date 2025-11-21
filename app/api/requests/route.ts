import z from 'zod';
import { findLoggedInUser } from '../_services/auth.service';
import { prisma } from '../prisma';
import { toRequestResponse } from '../_services/request.service';

const createRequestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  payee: z.string(),
  amount: z.number(),
  currency: z.string(),
  internalRef: z.string().optional(),
  externalRef: z.string().optional(),
  approverIds: z.string().array(),
  approvalFileId: z.string(),
  supportingFileIds: z.string().array().optional(),
  approvalFileDate: z.coerce.date(),
});

export async function POST(req: Request) {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const body = await req.json();
  const parsedBody = createRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    console.log(parsedBody.error);
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  const data = parsedBody.data;
  const request = await prisma.request.create({
    data: {
      title: data.title,
      description: data.description,
      payee: data.payee,
      amount: data.amount,
      currency: data.currency,
      internalRef: data.internalRef,
      externalRef: data.externalRef,
      requester: { connect: { id: user.id } },
      approvalFile: { connect: { id: data.approvalFileId } },
      approvalFileDate: data.approvalFileDate,
      supportingFiles: {
        connect: data.supportingFileIds?.map((id) => ({ id })) ?? [],
      },
      approvals: {
        create: data.approverIds.map((approverId) => ({
          approver: { connect: { id: approverId } },
        })),
      },
    },
    include: {
      approvals: true,
      requester: true,
    },
  });

  return Response.json(toRequestResponse(request), { status: 201 });
}
