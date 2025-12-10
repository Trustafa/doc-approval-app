'use client';

import RequestsScreen from '@/app/_screens/RequestsScreen';

export default function ReceivedRequestsPage() {
  return (
    <RequestsScreen
      baseRoute="/dashboard/requests/received"
      title="Received Requests"
      requestType="Received"
    />
  );
}
