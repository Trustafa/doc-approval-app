import { ApprovalDecision } from '@/generated/prisma/enums';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const statusQuery = searchParams.get('status');
  const typeQuery = searchParams.get('type');

  const statusIsPending = statusQuery === ApprovalDecision.PENDING;
  const statusIsApproved = statusQuery === ApprovalDecision.APPROVED;
  const statusIsRejected = statusQuery === ApprovalDecision.REJECTED;

  const typeIsSent = typeQuery === 'SENT';
  const typeIsReceived = typeQuery === 'RECEIVED';
}
