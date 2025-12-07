import { RequestFilters, RequestType } from '@/app/_types/request';
import { DashboardStats, RequestResponse } from '../_services/request.service';
import { apiFetch } from './apiFetch';

export type RequestsResult =
  | { success: true; data: RequestResponse[]; count: number }
  | { success: false; status: number };

export async function getRequests(
  requestType: RequestType,
  filters?: RequestFilters,
  params?: {
    page?: number;
    pageSize?: number;
  }
): Promise<RequestsResult> {
  const query = new URLSearchParams();

  const requestTypePage = requestType === 'Sent' ? 'sent' : 'received';

  if (filters?.payee) query.set('payee', filters.payee);
  if (filters?.idNumber !== undefined)
    query.set('idNumber', String(filters.idNumber));
  if (filters?.status && filters.status !== 'ALL')
    query.set('status', filters.status);
  if (filters?.amountFrom !== undefined)
    query.set('amountFrom', String(filters.amountFrom));
  if (filters?.amountTo !== undefined)
    query.set('amountTo', String(filters.amountTo));
  if (filters?.fromDate) query.set('fromDate', filters.fromDate);
  if (filters?.toDate) query.set('toDate', filters.toDate);
  if (filters?.internalRef) query.set('internalRef', filters.internalRef);
  if (filters?.externalRef) query.set('externalRef', filters.externalRef);

  if (filters?.sortBy) query.set('sortBy', filters.sortBy);
  if (filters?.sortOrder) query.set('sortOrder', filters.sortOrder);

  if (params?.page) query.set('page', String(params.page + 1));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));

  const res = await apiFetch(
    `/api/requests/${requestTypePage}?${query.toString()}`
  );

  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const json: { data: RequestResponse[]; count: number } = await res.json();
  return {
    success: true,
    data: json.data.map((r) => ({
      ...r,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
      approvalFileDate: new Date(r.approvalFileDate),
    })),
    count: json.count,
  };
}

export async function getRequestByID(requestId: string) {
  const res = await apiFetch(`/api/requests/${requestId}`);
  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const data = await res.json();

  return { success: true, data };
}

export async function submitRequest(data: {
  title: string;
  description?: string;
  payee: string;
  amount: number;
  currency: string;
  internalRef?: string;
  externalRef?: string;
  approverIds: string[];
  approvalFileId: string;
  supportingFileIds?: string[];
  approvalFileDate: Date;
}) {
  const res = await apiFetch('/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return { success: false, status: res.status };
  } else {
    return { success: true };
  }
}

export async function getDashboardStats() {
  const res = await apiFetch('/api/requests/stats');

  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const json = (await res.json()) as { data: DashboardStats };

  return { success: true, data: json.data };
}
