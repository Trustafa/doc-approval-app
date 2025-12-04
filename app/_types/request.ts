export type RequestFilters = {
  payee?: string;
  idNumber?: number;
  status?: string;
  amountFrom?: number;
  amountTo?: number;
  fromDate?: string;
  toDate?: string;
  internalRef?: string;
};

export type RequestType = 'Sent' | 'Received';
