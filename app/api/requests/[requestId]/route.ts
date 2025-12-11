import { ApprovalDecision } from '@/generated/prisma/enums';
import z from 'zod';
import { findLoggedInUser } from '../../_services/auth.service';
import {
  getRequestStatus,
  toRequestResponseWithFiles,
} from '../../_services/request.service';
import { prisma } from '../../prisma';

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

  return Response.json(toRequestResponseWithFiles(request), { status: 200 });
}

const updateRequestSchema = z.object({
  id: z.string(),
  title: z.string().nonempty(),
  description: z.string().optional(),
  payee: z.string().nonempty(),
  amount: z.number(),
  currency: z.string(),
  internalRef: z.string().optional(),
  externalRef: z.string().optional(),
  approverIds: z.string().array(),
  approvalFileId: z.string().nonempty(),
  supportingFileIds: z.string().array().optional(),
  approvalFileDate: z.coerce.date(),
});

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const parsedBody = updateRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  const user = await findLoggedInUser();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const { data } = parsedBody;

  const request = await prisma.request.findUnique({
    where: {
      id: data.id,
    },
    include: {
      approvals: { include: { approver: true } },
      approvalFile: true,
      signedApprovalFile: true,
    },
  });

  if (!request) {
    return new Response('Not Found', { status: 404 });
  }

  const requestStatus = getRequestStatus(request);

  if (
    !(
      requestStatus === ApprovalDecision.PENDING &&
      request.requesterId === user.id
    )
  ) {
    return new Response('Forbidden', { status: 403 });
  }

  await prisma.request.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description ?? '',
      payee: data.payee,
      amount: data.amount,
      currency: data.currency,
      internalRef: data.internalRef ?? '',
      externalRef: data.externalRef ?? '',
      approvals: {
        deleteMany: {},
        create: data.approverIds.map((approverId) => ({
          approver: { connect: { id: approverId } },
        })),
      },
      approvalFile: { connect: { id: data.approvalFileId } },
      supportingFiles: {
        connect: data.supportingFileIds?.map((id) => ({ id })) ?? [],
      },
      approvalFileDate: data.approvalFileDate,
    },
  });

  return new Response(null, { status: 204 });
}
