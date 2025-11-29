import { RequestType } from '@/app/_types/request';
import { RequestResponse } from '../_services/request.service';

export type RequestsResult =
  | { success: true; data: RequestResponse[]; count: number }
  | { success: false; status: number };

export async function getRequests(
  requestType: RequestType,
  params?: {
    status?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<RequestsResult> {
  const query = new URLSearchParams();

  const requestTypePage = requestType === 'Sent' ? 'sent' : 'received';

  if (params?.status) query.set('status', params.status);
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));

  const res = await fetch(
    `/api/requests/${requestTypePage}?${query.toString()}`
  );

  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const json: { data: RequestResponse[]; count: number } = await res.json();
  return {
    success: true,
    data: json.data,
    count: json.count,
  };
}
