'use client';

import DetailedView from '@/app/_screens/ApprovalsDetailedScreen';
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
    documentName: `Invoice ${id}`,
    requester: 'Bob',
    approvers: ['Alice', 'George'],
    amount: 10000,
    status: 'PENDING' as const,
    date: '10-11-2025',
  };
  return <DetailedView data={data} onClickBack={() => router.back()} />;
}
