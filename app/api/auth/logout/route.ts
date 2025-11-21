import { cookies } from 'next/headers';
import { findLoggedInSession } from '../../_services/auth.service';
import { prisma } from '../../prisma';

export async function POST(): Promise<Response> {
  const session = await findLoggedInSession();
  if (!session) {
    return new Response(null, { status: 401 });
  }

  await prisma.userSession.updateMany({
    where: { id: session.id, active: true },
    data: { active: false },
  });

  const cookieStore = await cookies();
  cookieStore.delete('session-id');

  return new Response(null, { status: 200 });
}
