import { User, UserSession } from '@/generated/prisma/client';
import { cookies } from 'next/headers';
import { findSessionById, isSessionExpired } from './session.service';
import { findUserBySessionId } from './user.service';

export async function findLoggedInUser(): Promise<User | null> {
  const session = await findLoggedInSession();
  if (!session) {
    return null;
  }

  const user = await findUserBySessionId(session.id);

  return user;
}

export async function findLoggedInSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session-id')?.value;
  if (!sessionId) {
    return null;
  }

  const session = await findSessionById(sessionId);
  if (!session?.active || isSessionExpired(session)) {
    return null;
  }

  return session;
}
