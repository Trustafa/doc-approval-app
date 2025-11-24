import {
  ApprovalDecision,
  Prisma,
  Request,
  User,
} from '@/generated/prisma/client';
import { toUserResponse } from './user.service';

type RequestWithRequester = Request &
  Prisma.RequestGetPayload<{
    include: { requester: true };
  }>;

export type RequestWithApprovals = Request &
  Prisma.RequestGetPayload<{
    include: { approvals: true };
  }>;

export type RequestWithApprovalsWithApprovers = Request &
  Prisma.RequestGetPayload<{
    include: { approvals: { include: { approver: true } } };
  }>;

export type RequestResponse = {
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
  idNumber: number;
};

export function toRequestResponse(
  request: Request & RequestWithApprovals & RequestWithRequester
): RequestResponse {
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
    requester: toUserResponse(request.requester),
    status: getRequestStatus(request),
    idNumber: request.idNumber,
  };
}

export function getRequestStatus(
  request: RequestWithApprovals
): ApprovalDecision | null {
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

export function findFirstApproverWithSignature(
  request: RequestWithApprovalsWithApprovers
): (User & { signatureFileId: string }) | null {
  const approval = request.approvals.find(
    (approval) =>
      approval.decision === ApprovalDecision.APPROVED &&
      approval.approver.signatureFileId
  );

  if (!approval || !approval.approver.signatureFileId) {
    return null;
  }

  return approval.approver as User & { signatureFileId: string };
}
