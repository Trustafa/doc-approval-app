'use client';

import RequestsScreen from '@/app/_screens/RequestsScreen';

export type ApprovalEntryData = {
  id: number;
  requestDate: string;
  payee: string;
  amount: number;
  currency: string;
  requester: string;
  status: string;
};

export default function ReceivedRequestsPage() {
  const requests = [
    {
      id: 1012,
      requestDate: '2024-10-18',
      payee: 'Acme Supplies Ltd.',
      amount: 450.75,
      currency: 'GBP',
      requester: 'John Smith',
      status: 'APPROVED',
    },
    {
      id: 1013,
      requestDate: '2024-10-20',
      payee: 'Global Stationery Co.',
      amount: 89.99,
      currency: 'GBP',
      requester: 'Sarah Johnson',
      status: 'PENDING',
    },
    {
      id: 1014,
      requestDate: '2024-10-21',
      payee: 'IT Hardware Express',
      amount: 1299.5,
      currency: 'USD',
      requester: 'Michael Brown',
      status: 'REJECTED',
    },
    {
      id: 1015,
      requestDate: '2024-10-22',
      payee: 'EventHub Services',
      amount: 750.0,
      currency: 'EUR',
      requester: 'Emily Davis',
      status: 'APPROVED',
    },
    {
      id: 1016,
      requestDate: '2024-10-25',
      payee: 'Office Cleaning Group',
      amount: 320.0,
      currency: 'GBP',
      requester: 'Daniel Wilson',
      status: 'PENDING',
    },
    {
      id: 1017,
      requestDate: '2024-10-26',
      payee: 'Catering World',
      amount: 567.25,
      currency: 'GBP',
      requester: 'Emma Thompson',
      status: 'APPROVED',
    },
    {
      id: 1018,
      requestDate: '2024-10-27',
      payee: 'TechFix Repairs',
      amount: 210.0,
      currency: 'USD',
      requester: 'Lucas Gray',
      status: 'REJECTED',
    },
  ];

  return (
    <RequestsScreen
      baseRoute="/dashboard/requests/received"
      title="Received Requests"
      requestType="Received"
    />
  );
}
