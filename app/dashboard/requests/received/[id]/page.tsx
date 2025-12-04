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

  return (
    <RequestDetailScreen requestId={id} onClickBack={() => router.back()} />
  );
}
