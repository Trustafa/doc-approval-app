import { RequestFilters } from '@/app/_types/request';

export function parseRequestFiltersFromSearchParams(
  params: URLSearchParams
): Partial<RequestFilters> {
  const filters: Partial<RequestFilters> = {};

  const idNumber = params.get('idNumber');
  if (idNumber !== null) filters.idNumber = Number(idNumber);

  const amountFrom = params.get('amountFrom');
  if (amountFrom !== null) filters.amountFrom = Number(amountFrom);

  const payee = params.get('payee');
  if (payee !== null) filters.payee = payee;

  const status = params.get('status');
  if (status !== null) filters.status = status;

  const fromDate = params.get('fromDate');
  if (fromDate !== null) filters.fromDate = fromDate;

  const toDate = params.get('toDate');
  if (toDate !== null) filters.toDate = toDate;

  const internalRef = params.get('internalRef');
  if (internalRef !== null) filters.internalRef = internalRef;

  const externalRef = params.get('externalRef');
  if (externalRef !== null) filters.externalRef = externalRef;

  const sortBy = params.get('sortBy');
  if (sortBy !== null) filters.sortBy = sortBy;

  const sortOrder = params.get('sortOrder');
  if (sortOrder === 'asc' || sortOrder === 'desc')
    filters.sortOrder = sortOrder;

  return filters;
}
