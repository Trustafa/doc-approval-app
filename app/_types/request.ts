export type RequestFilters = {
  payee?: string;
  name?: string;
  idNumber?: number;
  status?: string;
  amountFrom?: number;
  amountTo?: number;
  fromDate?: string;
  toDate?: string;
  internalRef?: string;
};

export type RequestType = 'Sent' | 'Recieved';
