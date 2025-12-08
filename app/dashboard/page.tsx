import { redirect } from 'next/navigation';
import DashboardScreen from '../_screens/DashboardScreen';
import { findLoggedInUser } from '../api/_services/auth.service';

export default async function DashboardPage() {
  const user = await findLoggedInUser();

  if (!user) {
    redirect('/login');
  }
  return <DashboardScreen />;
}
