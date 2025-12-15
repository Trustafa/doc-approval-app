import RequestsScreen from '@/app/_screens/RequestsScreen';
import { Suspense } from 'react';

export default function ReceivedRequestsPage() {
  return (
    <Suspense>
      <RequestsScreen
        baseRoute="/dashboard/requests/received"
        title="Received Requests"
        requestType="Received"
      />
    </Suspense>
  );
}
