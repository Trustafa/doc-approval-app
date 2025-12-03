type ApprovalRequestResult<dataType> =
  | { success: true; data: dataType }
  | { success: false; status: number };

export async function approveRequest(requestId: string) {
  const res = await fetch(`/api/requests/${requestId}/approve`, {
    method: 'POST',
  });

  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const approval = await res.json();

  return { success: true, status: res.status, data: approval };
}

export async function rejectRequest(requestId: string) {
  const res = await fetch(`/api/requests/${requestId}/reject`, {
    method: 'POST',
  });

  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const rejection = await res.json();

  return { success: true, status: res.status, data: rejection };
}

export async function getApprovalsForRequest(requestId: string) {
  const res = await fetch(`/api/requests/${requestId}/approvals`);
  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const json = await res.json();

  return {
    success: true,
    data: json.data,
    myApproval: json.myApproval,
    canApprove: json.canApprove,
  };
}
