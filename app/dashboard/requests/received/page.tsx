'use client';

import RequestsScreen from '@/app/_screens/RequestsScreen';

export type ApprovalEntryData = {
  id: number;
  documentName: string;
  requester: string;
  approvers: string[];
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
};

export default function ReceivedRequestsPage() {
  const approvals = [
    {
      id: 1,
      documentName: 'Invoice 1',
      date: '10-11-2025',
      amount: 10000,
      requester: 'Bob',
      approvers: ['Alice', 'George'],
      status: 'PENDING' as const,
    },
    {
      id: 2,
      documentName: 'Invoice 2',
      date: '09-11-2025',
      amount: 15000,
      requester: 'Bob',
      approvers: ['Alice', 'George'],
      status: 'PENDING' as const,
    },
    {
      id: 3,
      documentName: 'Invoice 3',
      date: '07-11-2025',
      amount: 104500,
      requester: 'Bob',
      approvers: ['Alice', 'George'],
      status: 'PENDING' as const,
    },
  ];

  return (
    <RequestsScreen
      data={approvals}
      baseRoute="/dashboard/requests/received"
      title="Received Requests"
    />
  );
}
