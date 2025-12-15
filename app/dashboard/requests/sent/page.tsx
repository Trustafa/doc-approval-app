import RequestsScreen from '@/app/_screens/RequestsScreen';
import { Suspense } from 'react';

export default function SentRequestsPage() {
  return (
    <Suspense>
      <RequestsScreen
        baseRoute="/dashboard/requests/sent"
        title="Sent Requests"
        requestType="Sent"
      />
    </Suspense>
  );
}
