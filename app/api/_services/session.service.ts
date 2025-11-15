import { UserSession } from '@/generated/prisma/client';
import { prisma } from '../prisma';

export async function findSessionById(id: string): Promise<UserSession | null> {
  if (!id) return null;

  return prisma.userSession.findUnique({ where: { id } });
}

export async function createSession(input: {
  userId: number;
  expiresAt?: Date;
  userAgent?: string;
  ipAddress?: string;
}): Promise<UserSession> {
  return prisma.userSession.create({
    data: {
      user: { connect: { id: input.userId } },
      expiresAt: input.expiresAt,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    },
  });
}

export async function deactivateSessionById(
  id: string
): Promise<UserSession | null> {
  if (!id) return null;

  return prisma.userSession.update({
    where: { id, active: true },
    data: { active: false },
  });
}

export function isSessionExpired(session: UserSession): boolean {
  if (!session.expiresAt) return false;
  return session.expiresAt < new Date();
}
