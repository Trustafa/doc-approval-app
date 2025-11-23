import { findLoggedInUser } from '@/app/api/_services/auth.service';
import {
  findFirstApproverWithSignature,
  getRequestStatus,
} from '@/app/api/_services/request.service';
import { prisma } from '@/app/api/prisma';
import { ApprovalDecision } from '@/generated/prisma/enums';
import {
  createSignedFile,
  toFileResponse,
} from '@/app/api/_services/file.service';
import { NextResponse } from 'next/server';

export async function GET(
  _: unknown,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const user = await findLoggedInUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { requestId } = await params;
  const request = await prisma.request.findUnique({
    where: {
      id: requestId,
      OR: [
        { requesterId: user.id },
        { approvals: { some: { approverId: user.id } } },
      ],
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

  if (requestStatus !== ApprovalDecision.APPROVED) {
    return new Response('Forbidden', { status: 403 });
  }

  if (request.signedApprovalFile) {
    return NextResponse.json(toFileResponse(request.signedApprovalFile), {
      status: 200,
    });
  }

  //TODO: Allow for multiple signatures
  const approver = findFirstApproverWithSignature(request);

  if (!approver) {
    return new Response('No approvers with signature', { status: 403 });
  }

  const signatureFile = await prisma.file.findUniqueOrThrow({
    where: { id: approver.signatureFileId! },
  });
  const signedFile = await createSignedFile(
    request.approvalFile,
    signatureFile
  );

  if (!signedFile) {
    return new Response('Error creating signed file', { status: 500 });
  }

  return Response.json(toFileResponse(signedFile), { status: 200 });
}
