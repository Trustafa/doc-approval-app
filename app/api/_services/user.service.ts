import { User } from '@/generated/prisma/client';
import { prisma } from '../prisma';
import bcrypt from 'bcrypt';

export async function findUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function findUserBySessionId(id: string): Promise<User | null> {
  if (!id) return null;

  const session = await prisma.userSession.findUnique({
    where: { id },
    select: { user: true },
  });

  return session?.user ?? null;
}

export async function updateUser(
  id: number,
  input: Partial<User>
): Promise<User> {
  return prisma.user.update({ where: { id }, data: input });
}

export async function updateUserPassword(
  id: number,
  password: string
): Promise<User> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return prisma.user.update({ where: { id }, data: { hashedPassword } });
}

export type UserResponse = {
  id: number;
  createdAt: string;
  updatedAt: string;

  email: string;
  name: string;
};

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    email: user.email,
    name: user.name,
  };
}
