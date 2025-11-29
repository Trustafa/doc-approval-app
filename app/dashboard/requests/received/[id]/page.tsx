'use client';

import RequestDetailScreen from '@/app/_screens/RequestDetailedScreen';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function RecievedRequestDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const data = {
    id: Number(id),
    payee: `Invoice ${id}`,
    requester: 'Alice',
    approvers: ['Bob', 'Charlie'],
    amount: 5000,
    status: 'PENDING' as const,
    requestDate: '2025-11-11',
    currency: 'AED',
  };
  return <RequestDetailScreen data={data} onClickBack={() => router.back()} />;
}
