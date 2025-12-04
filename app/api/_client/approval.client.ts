import { ApprovalResponse } from '../_services/approval.service';
import { apiFetch } from './apiFetch';

type ApprovalResult =
  | { success: true; data: ApprovalResponse[]; canApprove: boolean }
  | { success: false; status: number };

export async function approveRequest(requestId: string) {
  const res = await apiFetch(`/api/requests/${requestId}/approve`, {
    method: 'POST',
  });

  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const approval = await res.json();

  return { success: true, status: res.status, data: approval };
}

export async function rejectRequest(requestId: string) {
  const res = await apiFetch(`/api/requests/${requestId}/reject`, {
    method: 'POST',
  });

  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const rejection = await res.json();

  return { success: true, status: res.status, data: rejection };
}

export async function getApprovalsForRequest(
  requestId: string
): Promise<ApprovalResult> {
  const res = await apiFetch(`/api/requests/${requestId}/approvals`);
  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const json = await res.json();

  return {
    success: true,
    data: json.data,
    canApprove: json.canApprove,
  };
}
