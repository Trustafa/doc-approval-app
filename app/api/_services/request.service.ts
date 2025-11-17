import {
  ApprovalDecision,
  Prisma,
  Request,
  User,
} from '@/generated/prisma/client';
import { prisma } from '../prisma';

type RequestWithRequester = Prisma.RequestGetPayload<{
  include: { requester: true };
}>;

type RequestWithApprovalFile = Prisma.RequestGetPayload<{
  include: { approvalFile: true };
}>;

type RequestWithSupportingFiles = Prisma.RequestGetPayload<{
  include: { supportingFiles: true };
}>;

type RequestWithFiles = RequestWithApprovalFile & RequestWithSupportingFiles;

type RequestWithApprovals = Prisma.RequestGetPayload<{
  include: { approvals: true };
}>;

export async function createRequest(input: {
  title: string;
  description?: string;
  payee: string;
  amount: number;
  currency: string;
  internalRef?: string;
  externalRef?: string;
  approvalFileDate: Date;
  approvalFileId: string;
  supportingFileIds: string[];
  approverIds: string[];
  requesterId: string;
}): Promise<RequestWithRequester & RequestWithFiles & RequestWithApprovals> {
  return prisma.request.create({
    data: {
      title: input.title,
      description: input.description,
      payee: input.payee,
      amount: input.amount,
      currency: input.currency,
      internalRef: input.internalRef,
      externalRef: input.externalRef,
      requester: { connect: { id: input.requesterId } },
      approvalFile: {
        connect: { id: input.approvalFileId },
      },
      supportingFiles: {
        connect: input.supportingFileIds.map((id) => ({ id })),
      },
      approvalFileDate: input.approvalFileDate,
      approvals: {
        createMany: {
          data: input.approverIds.map((approverId) => ({ approverId })),
        },
      },
    },
    include: {
      supportingFiles: true,
      approvalFile: true,
      requester: true,
      approvals: true,
    },
  });
}

export async function findRequestsBySender(
  senderId: string,
  opts?: Partial<{ skip: number; take: number; status: ApprovalDecision }>
): Promise<[(RequestWithApprovals & RequestWithApprovalFile)[], number]> {
  const where: Prisma.RequestWhereInput = { requesterId: senderId };

  switch (opts?.status) {
    case ApprovalDecision.PENDING:
    case ApprovalDecision.REJECTED:
      where.approvals = { some: { decision: opts.status } };
      break;
    case ApprovalDecision.APPROVED:
      where.approvals = { every: { decision: opts.status } };
  }

  const requests = await prisma.request.findMany({
    where,
    skip: opts?.skip,
    take: opts?.take,
    include: {
      approvalFile: true,
      approvals: true,
    },
  });
  const totalCount = await prisma.request.count({ where });

  return [requests, totalCount];
}

export async function findRequestsByReceiver(
  receiverId: string,
  opts?: Partial<{ skip: number; take: number; status: ApprovalDecision }>
): Promise<[(RequestWithApprovalFile & RequestWithRequester)[], number]> {
  const where: Prisma.RequestWhereInput = {
    approvals: { some: { OR: [{ approverId: receiverId }] } },
  };

  switch (opts?.status) {
    case ApprovalDecision.PENDING:
    case ApprovalDecision.REJECTED:
      where.approvals = { some: { decision: opts.status } };
      break;
    case ApprovalDecision.APPROVED:
      where.approvals = { every: { decision: opts.status } };
  }

  const requests = await prisma.request.findMany({
    where,
    skip: opts?.skip,
    take: opts?.take,
    include: {
      requester: true,
      approvalFile: true,
    },
  });
  const totalCount = await prisma.request.count({ where });
  return [requests, totalCount];
}

type RequestSummaryResponse = {
  id: string;
  createdAt: Date;
  approvalFileDate: Date;
  approvalFileId: string;
  payee: string;
  amount: number;
  currency: string;
  createdByName: string;
  status: ApprovalDecision;
};
export function toRequestSummaryResponse(
  request: RequestWithRequester & RequestWithApprovalFile & RequestWithApprovals
): RequestSummaryResponse {
  let status: ApprovalDecision = ApprovalDecision.PENDING;
  for (const approval of request.approvals) {
    if (
      approval.decision === ApprovalDecision.REJECTED ||
      approval.decision === ApprovalDecision.APPROVED
    ) {
      status = approval.decision;
      break;
    }
  }

  return {
    id: request.id,
    createdAt: request.createdAt,
    approvalFileDate: request.approvalFileDate,
    approvalFileId: request.approvalFile.id,
    payee: request.payee,
    amount: request.amount.toNumber(),
    currency: request.currency,
    createdByName: request.requester.name,
    status,
  };
}

export async function findRequestById(
  id: string
): Promise<
  (RequestWithRequester & RequestWithFiles & RequestWithApprovals) | null
> {
  return prisma.request.findUnique({
    where: { id },
    include: {
      requester: true,
      supportingFiles: true,
      approvalFile: true,
      approvals: true,
    },
  });
}

export function isRequestSender(user: User, request: Request): boolean {
  return user.id === request.requesterId;
}

export function isRequestApprover(
  user: User,
  request: RequestWithApprovals
): boolean {
  return request.approvals.some((a) => a.approverId === user.id);
}
