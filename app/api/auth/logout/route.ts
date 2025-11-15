import { cookies } from 'next/headers';
import { findLoggedInSession } from '../../_services/auth.service';
import { deactivateSessionById } from '../../_services/session.service';

export async function POST(): Promise<Response> {
  const session = await findLoggedInSession();
  if (!session) {
    return new Response(null, { status: 401 });
  }

  await deactivateSessionById(session.id);

  const cookieStore = await cookies();
  cookieStore.delete('session-id');

  return new Response(null, { status: 200 });
}
