import { Approval, ApprovalDecision, Prisma } from '@/generated/prisma/client';
import { toUserResponse, UserResponse } from './user.service';

export type ApprovalWithApprover = Approval &
  Prisma.ApprovalGetPayload<{
    include: { approver: true };
  }>;

export type ApprovalResponse = {
  id: string;
  createdAt: Date;
  requestId: string;
  decision: ApprovalDecision;
  decidedAt: Date | null;
  rejectionReason?: string | null;
  approver: UserResponse;
};

export function toApprovalResponse(
  approval: ApprovalWithApprover
): ApprovalResponse {
  return {
    id: approval.id,
    createdAt: approval.createdAt,
    requestId: approval.requestId,
    decision: approval.decision,
    decidedAt: approval.decisionAt,
    rejectionReason: approval.rejectionReason,
    approver: toUserResponse(approval.approver),
  };
}
