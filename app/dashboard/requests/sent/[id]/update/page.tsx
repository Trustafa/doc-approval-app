'use client';

import UpdateRequestScreen from '@/app/_screens/UpdateRequestScreen';
import { use } from 'react';

export default function UpdateRequestSent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <UpdateRequestScreen requestId={id} />;
}
