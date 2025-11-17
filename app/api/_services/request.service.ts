import {
  ApprovalDecision,
  Prisma,
  Request,
  User,
  File as FileEntity,
  Approval,
} from '@/generated/prisma/client';
import { prisma } from '../prisma';

type RequestWithRequester = Request &
  Prisma.RequestGetPayload<{
    include: { requester: true };
  }>;

type RequestWithApprovalFile = Request &
  Prisma.RequestGetPayload<{
    include: { approvalFile: true };
  }>;

type RequestWithSupportingFiles = Request &
  Prisma.RequestGetPayload<{
    include: { supportingFiles: true };
  }>;

type RequestWithFiles = RequestWithApprovalFile & RequestWithSupportingFiles;

type RequestWithApprovals = Request &
  Prisma.RequestGetPayload<{
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

export async function getRequestByIdAndUser(
  id: string,
  user: User
): Promise<
  (RequestWithApprovals & RequestWithFiles & RequestWithRequester) | null
> {
  return prisma.request.findUnique({
    where: {
      id,
      OR: [
        { requesterId: user.id },
        { approvals: { some: { approverId: user.id } } },
      ],
    },
    include: {
      requester: true,
      supportingFiles: true,
      approvalFile: true,
      approvals: true,
    },
  });
}

type RequestResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  payee: string;
  amount: number;
  currency: string;
  approvalFileDate: Date;
  title: string;
  description?: string | null;
  internalRef?: string | null;
  externalRef?: string | null;

  requester?: {
    id: string;
    name: string;
    email: string;
  };

  approvalFile?: {
    id: string;
    filename: string;
    sizeInBytes: number;
  };

  status: ApprovalDecision | null;
};

export function toRequestResponse(
  request: Request &
    Partial<RequestWithApprovals & RequestWithRequester & RequestWithFiles>
): RequestResponse {
  const toFileResponse = (file: FileEntity) => ({
    id: file.id,
    filename: file.filename,
    sizeInBytes: file.sizeInBytes,
  });

  const toUserResponse = (user: User) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  return {
    id: request.id,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    payee: request.payee,
    amount: request.amount.toNumber(),
    currency: request.currency,
    approvalFileDate: request.approvalFileDate,
    title: request.title,
    description: request.description,
    internalRef: request.internalRef,
    externalRef: request.externalRef,
    requester: request.requester && toUserResponse(request.requester),
    approvalFile: request.approvalFile && toFileResponse(request.approvalFile),
    status: getRequestStatus(request),
  };
}

export function getRequestStatus(
  request: Request & Partial<RequestWithApprovals>
): ApprovalDecision | null {
  if (!request.approvals) return null;

  const approvalsCount = request.approvals.length;
  const approvedCount = request.approvals.filter(
    (a) => a.decision === ApprovalDecision.APPROVED
  ).length;
  const rejectedCount = request.approvals.filter(
    (a) => a.decision === ApprovalDecision.REJECTED
  ).length;
  const pendingCount = approvalsCount - approvedCount - rejectedCount;

  if (rejectedCount > 0) return ApprovalDecision.REJECTED;
  if (pendingCount > 0) return ApprovalDecision.PENDING;

  return ApprovalDecision.APPROVED;
}

export async function approveRequestByUser(
  requestId: string,
  user: User
): Promise<boolean> {
  const { count } = await prisma.approval.updateMany({
    where: {
      requestId,
      approverId: user.id,
      decision: ApprovalDecision.PENDING,
    },
    data: {
      decision: ApprovalDecision.APPROVED,
      decisionAt: new Date(),
    },
  });

  return count === 1;
}

export async function rejectRequestByUser(
  requestId: string,
  user: User
): Promise<boolean> {
  const { count } = await prisma.approval.updateMany({
    where: {
      requestId,
      approverId: user.id,
      decision: ApprovalDecision.PENDING,
    },
    data: {
      decision: ApprovalDecision.REJECTED,
      decisionAt: new Date(),
    },
  });

  return count === 1;
}
