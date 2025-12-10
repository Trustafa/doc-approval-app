'use client';

import RequestsScreen from '@/app/_screens/RequestsScreen';

export default function SentRequestsPage() {
  return (
    <RequestsScreen
      baseRoute="/dashboard/requests/sent"
      title="Sent Requests"
      requestType="Sent"
    />
  );
}
