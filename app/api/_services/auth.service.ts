import { User, UserSession } from '@/generated/prisma/client';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma';

export async function findLoggedInUser(): Promise<User | null> {
  const session = await findLoggedInSession();
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (user?.disabled) return null;

  return user;
}

export async function findLoggedInSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session-id')?.value;
  if (!sessionId) {
    return null;
  }

  const session = await prisma.userSession.findUnique({
    where: {
      id: sessionId,
      active: true,
      expiresAt: { gt: new Date() },
    },
  });
  if (!session) {
    return null;
  }

  return session;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
